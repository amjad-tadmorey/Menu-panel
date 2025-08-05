import { supabase } from "./supabase"
import { v4 as uuidv4 } from 'uuid';


// const applyFilters = (query, filters = []) => {
//   filters.forEach(({ column, operator, value }) => {
//     query = query[operator](column, value)
//   })
//   return query
// }



export const buildSelect = (relations = []) => {
  return relations
    .map((rel) => {
      if (typeof rel === 'string') return `${rel}(*)`;

      if (typeof rel === 'object' && rel.relation) {
        if (rel.nested) {
          return `${rel.relation}:${rel.foreignKey}(${buildSelect(rel.nested)})`;
        }
        return `${rel.relation}:${rel.foreignKey}(*)`;
      }

      throw new Error('Invalid includeRelations format');
    })
    .join(', ');
};


// 🟢 SELECT
export const supaQuery = async (table, options = {}) => {
  const {
    select,
    filters = [],
    limit,
    offset,
    orderBy,
    single = false,
  } = options;

  let query = supabase.from(table).select(select || '*');

  filters.forEach((filter) => {
    query = query.eq(filter.column, filter.value);
  });

  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending });
  }

  if (limit) query = query.limit(limit);
  if (offset) query = query.offset(offset);
  if (single) query = query.single();

  const { data, error } = await query;
  if (error) throw error;
  return data;
};




// 🟢 INSERT
export async function supaInsert(table, payload) {
  const { data, error } = await supabase.from(table).insert(payload).select()
  if (error) throw error
  return data
}

// 🟢 DELETE
export async function supaDelete(table, match) {
  const { data, error } = await supabase.from(table).delete().match(match)
  if (error) throw error
  return data
}

// 🟢 UPDATE
export async function supaUpdate(table, match, updates) {

  const { data, error } = await supabase.from(table).update(updates).match(match)
  if (error) throw error
  return data
}


export async function uploadShopData(shop) {
  try {
    // Extract logo image file
    const logoFile = shop.logo;
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage (bucket: logos)
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, logoFile);

    if (uploadError) {
      console.error('Image upload error:', uploadError.message);
      return { error: uploadError };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    const logoUrl = publicUrlData.publicUrl;

    // Replace the logo object with the URL
    const shopData = {
      ...shop,
      logo: logoUrl,
    };

    // Insert into shops table
    const { data, error } = await supabase
      .from('shops')
      .insert(shopData)
      .select();

    if (error) {
      console.error('Insert error:', error.message);
      return { error };
    }

    return { data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err };
  }
}



export const fetchOrdersWithTableNumberAndItems = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      table:table_id (
        table_number
      ),
      order_items (
        id,
        quantity,
        unit_price,
        menu_id,
        order_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders with items:', error);
    throw error;
  }

  return data;
}