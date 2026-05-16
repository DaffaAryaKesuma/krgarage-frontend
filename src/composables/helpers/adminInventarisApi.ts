import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type {
  InventarisCategory,
  InventarisSukuCadang,
  InventarisSukuCadangForm,
} from "@/types/inventaris";

export async function fetchAdminInventarisCategories() {
  const { data } = await axios.get(`${API_URL}/admin/inventori/kategori`, {
    headers: getAuthHeaders(),
  });

  return (data.data || []) as InventarisCategory[];
}

export function createAdminInventarisCategory(name: string) {
  return axios.post(
    `${API_URL}/admin/inventori/kategori`,
    { nama: name },
    { headers: getAuthHeaders() },
  );
}

export async function fetchAdminInventarisSukuCadang() {
  const { data } = await axios.get(`${API_URL}/admin/inventori`, {
    headers: getAuthHeaders(),
  });

  return (data.data || []) as InventarisSukuCadang[];
}

export function createAdminInventarisSukuCadang(payload: InventarisSukuCadangForm) {
  return axios.post(`${API_URL}/admin/inventori`, payload, {
    headers: getAuthHeaders(),
  });
}

export function updateAdminInventarisSukuCadang(
  sukucadangId: number,
  payload: InventarisSukuCadangForm,
) {
  return axios.put(`${API_URL}/admin/inventori/${sukucadangId}`, payload, {
    headers: getAuthHeaders(),
  });
}

export function restockAdminInventarisSukuCadang(
  sukucadangId: number,
  quantity: number,
) {
  return axios.post(
    `${API_URL}/admin/inventori/${sukucadangId}/tambah-stok`,
    { jumlah: quantity },
    { headers: getAuthHeaders() },
  );
}

export function deleteAdminInventarisSukuCadang(sukucadangId: number) {
  return axios.delete(`${API_URL}/admin/inventori/${sukucadangId}`, {
    headers: getAuthHeaders(),
  });
}
