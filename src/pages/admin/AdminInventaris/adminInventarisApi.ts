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

export function createAdminInventarisCategory(namaKategori: string) {
  return axios.post(
    `${API_URL}/admin/inventori/kategori`,
    { nama: namaKategori },
    { headers: getAuthHeaders() },
  );
}

export async function fetchAdminInventarisSukuCadang() {
  const { data } = await axios.get(`${API_URL}/admin/inventori`, {
    headers: getAuthHeaders(),
  });

  return (data.data || []) as InventarisSukuCadang[];
}

export function createAdminInventarisSukuCadang(dataSukuCadang: InventarisSukuCadangForm) {
  return axios.post(`${API_URL}/admin/inventori`, dataSukuCadang, {
    headers: getAuthHeaders(),
  });
}

export function updateAdminInventarisSukuCadang(
  idSukuCadang: number,
  dataSukuCadang: InventarisSukuCadangForm,
) {
  return axios.put(`${API_URL}/admin/inventori/${idSukuCadang}`, dataSukuCadang, {
    headers: getAuthHeaders(),
  });
}

export function restockAdminInventarisSukuCadang(
  idSukuCadang: number,
  dataRestok: {
    jumlah: number;
    harga_beli_satuan: number;
    update_harga_beli: boolean;
    catatan?: string;
  },
) {
  return axios.post(
    `${API_URL}/admin/inventori/${idSukuCadang}/tambah-stok`,
    dataRestok,
    { headers: getAuthHeaders() },
  );
}

export function deleteAdminInventarisSukuCadang(idSukuCadang: number) {
  return axios.delete(`${API_URL}/admin/inventori/${idSukuCadang}`, {
    headers: getAuthHeaders(),
  });
}
