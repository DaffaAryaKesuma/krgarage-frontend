// File ini khusus berisi fungsi request API inventaris admin.
// Tujuannya supaya composable halaman tidak penuh dengan detail endpoint.
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type {
  InventarisCategory,
  InventarisSukuCadang,
  InventarisSukuCadangForm,
} from "@/types/inventaris";

// Mengambil daftar kategori suku cadang dari backend.
export async function fetchAdminInventarisCategories() {
  const { data } = await axios.get(`${API_URL}/admin/inventori/kategori`, {
    headers: getAuthHeaders(),
  });

  // Response backend dibungkus di data.data, fallback [] agar aman.
  return (data.data || []) as InventarisCategory[];
}

// Membuat kategori baru.
export function createAdminInventarisCategory(namaKategori: string) {
  return axios.post(
    `${API_URL}/admin/inventori/kategori`,
    { nama: namaKategori },
    { headers: getAuthHeaders() },
  );
}

// Mengambil seluruh daftar suku cadang.
export async function fetchAdminInventarisSukuCadang() {
  const { data } = await axios.get(`${API_URL}/admin/inventori`, {
    headers: getAuthHeaders(),
  });

  return (data.data || []) as InventarisSukuCadang[];
}

// Menambah suku cadang baru.
export function createAdminInventarisSukuCadang(dataSukuCadang: InventarisSukuCadangForm) {
  return axios.post(`${API_URL}/admin/inventori`, dataSukuCadang, {
    headers: getAuthHeaders(),
  });
}

// Mengubah data suku cadang berdasarkan id.
export function updateAdminInventarisSukuCadang(
  idSukuCadang: number,
  dataSukuCadang: InventarisSukuCadangForm,
) {
  return axios.put(`${API_URL}/admin/inventori/${idSukuCadang}`, dataSukuCadang, {
    headers: getAuthHeaders(),
  });
}

// Menambah stok suku cadang dan mencatat riwayat restock di backend.
export function restockAdminInventarisSukuCadang(
  idSukuCadang: number,
  dataRestok: {
    jumlah: number;
    harga_beli_satuan: number;
    update_harga_beli: boolean;
    catatan?: string;
    foto_struk?: File | null;
  },
) {
  const formData = new FormData();
  formData.append("jumlah", String(dataRestok.jumlah));
  formData.append("harga_beli_satuan", String(dataRestok.harga_beli_satuan));
  formData.append("update_harga_beli", dataRestok.update_harga_beli ? "1" : "0");

  if (dataRestok.catatan) {
    formData.append("catatan", dataRestok.catatan);
  }

  if (dataRestok.foto_struk) {
    formData.append("foto_struk", dataRestok.foto_struk);
  }

  return axios.post(
    `${API_URL}/admin/inventori/${idSukuCadang}/tambah-stok`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

// Menghapus suku cadang berdasarkan id.
export function deleteAdminInventarisSukuCadang(idSukuCadang: number) {
  return axios.delete(`${API_URL}/admin/inventori/${idSukuCadang}`, {
    headers: getAuthHeaders(),
  });
}
