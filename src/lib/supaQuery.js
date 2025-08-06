import { restaurantId, SUPABASE_URL } from "../constants/remote";
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
  query.eq('restaurant_id', restaurantId)
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


// lib/uploadImage.js
export const createMenuItem = async (data) => {
  const { error } = await supabase.from("menu").insert(data);
  if (error) throw error;
  return true;
};

export const uploadImage = async (file) => {
  if (!file) throw new Error("No image file provided");

  const ext = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${ext}-${restaurantId}`;

  const { error } = await supabase.storage.from("items").upload(fileName, file);
  if (error) throw error;

  return `${SUPABASE_URL}/storage/v1/object/public/items/${fileName}`;
};
