// storage.js – wrapper untuk mengakses data bisnis lewat Supabase (bukan localStorage)
// Semua fungsi mengembalikan Promise yang menyelesaikan dengan data yang diminta.
// Modul ini menggantikan penggunaan localStorage yang sebelumnya menyimpan
// store, users, products, hist, seq, dll.

import { supabase } from "./supabase.js";

// ---------- Profil & Pengaturan ----------
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select();
  if (error) throw error;
  return data;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();
  if (error) throw error;
  return data;
}

export async function updateSettings(updates) {
  const { data, error } = await supabase.from("settings").upsert(updates, { returning: "representation" });
  if (error) throw error;
  return data;
}

// ---------- Produk ----------
export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
}

export async function addProduct(product) {
  const { data, error } = await supabase.from("products").insert([product]);
  if (error) throw error;
  return data[0];
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ---------- Penjualan (sales) ----------
export async function createSale({ items, discount = 0, ppn = true, method = "Tunai", paid = 0 }) {
  // items: [{id, qty}]
  const { data, error } = await supabase.rpc("create_sale", {
    p_items: items,
    p_discount: discount,
    p_ppn: ppn,
    p_method: method,
    p_paid: paid,
  });
  if (error) throw error;
  return data; // berisi id struk, total, kembalian, dsb.
}

export async function fetchSales({ from, to, cashierId, method, limit = 20, offset = 0 } = {}) {
  let query = supabase.from("sales").select("*, sale_items!inner(*)", { count: "exact" });
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);
  if (cashierId) query = query.eq("created_by", cashierId);
  if (method) query = query.eq("method", method);
  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  const { data, error, count } = await query;
  if (error) throw error;
  return { rows: data, total: count };
}

// ---------- Utilitas ----------
export async function resetAllData() {
  // Memanggil RPC reset_data di Supabase (hanya owner yang dapat).
  const { data, error } = await supabase.rpc("reset_data");
  if (error) throw error;
  return data;
}
