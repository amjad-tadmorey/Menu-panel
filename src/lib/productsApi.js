import { restaurantId, SUPABASE_URL } from "../constants/remote"
import { supabase } from "./supabase"
import { v4 as uuidv4 } from 'uuid';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('menu')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        menu_id,
        order_id
      )
    `).eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export const uploadImage = async (file) => {
  if (!file) throw new Error("No image file provided");

  const ext = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${ext}-${restaurantId}`;

  const { error } = await supabase.storage.from("items").upload(fileName, file);
  if (error) throw error;

  return `${SUPABASE_URL}/storage/v1/object/public/items/${fileName}`;
};
