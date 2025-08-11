import { restaurantId } from "../constants/remote"
import { supabase } from "./supabase"
import { endOfDay, startOfDay } from "date-fns"
import QRCode from "qrcode";

export async function fetchTablesWithOrders() {
  const { data, error } = await supabase
    .from('tables')
    .select(`
      *,
      orders (
        *
      )
    `).eq('restaurant_id', restaurantId)

  if (error) throw error
  return data
}

export async function createTable() {
  const start = startOfDay(new Date()).toISOString();
  const end = endOfDay(new Date()).toISOString();

  // 1. احضر آخر table_number لليوم
  const { data: latestTable, error: fetchError } = await supabase
    .from("tables")
    .select("table_number")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", start)
    .lte("created_at", end)
    .order("table_number", { ascending: false })
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error("Error fetching latest table: " + fetchError.message);
  }

  const nextTableNumber = (latestTable?.table_number || 0) + 1;

  // 2. إنشاء الطاولة
  const { data: table, error: insertTableError } = await supabase
    .from("tables")
    .insert({
      restaurant_id: restaurantId,
      table_number: nextTableNumber,
    })
    .select()
    .single();

  if (insertTableError) {
    throw new Error("Error inserting table: " + insertTableError.message);
  }

  // 3. توليد QR كـ Blob
  const qrText = `https://menu-eta-wine.vercel.app?restaurant_id=${restaurantId}&table_id=${table.id}`;
  const dataUrl = await QRCode.toDataURL(qrText, { width: 300 });
  const blob = await fetch(dataUrl).then((res) => res.blob());

  // 4. رفع QR إلى bucket
  const fileName = `table-${table.id}.png`;
  const { error: uploadError } = await supabase.storage
    .from("qr")
    .upload(fileName, blob, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) {
    throw new Error("Error uploading QR: " + uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("qr")
    .getPublicUrl(fileName);

  const qrImageUrl = publicUrlData.publicUrl;

  const { data: updatedTable, error: updateError } = await supabase
    .from("tables")
    .update({
      qr_url: qrText,
      qr_image: qrImageUrl,
    })
    .eq("id", table.id)
    .select()
    .single();

  if (updateError) {
    throw new Error("Error updating table with QR: " + updateError.message);
  }

  // 7. إرجاع الصف المحدث
  return updatedTable;
}