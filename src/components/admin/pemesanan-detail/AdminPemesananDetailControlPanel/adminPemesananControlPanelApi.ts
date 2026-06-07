// File ini khusus request API untuk panel kontrol detail pemesanan admin.
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { Mekanik } from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/adminPemesananControlPanelHelpers";

// Mengubah status servis pemesanan.
export async function patchAdminPemesananStatus(
  idPemesanan: number,
  status: string,
  catatan?: string,
) {
  // Payload minimal berisi status baru.
  const payload: any = { status };
  // Catatan hanya dikirim saat aksi selesai membutuhkan catatan mekanik.
  if (catatan) {
    payload.catatan_mekanik = catatan;
  }

  return axios.patch(
    `${API_URL}/admin/pemesanan/${idPemesanan}/status`,
    payload,
    { headers: getAuthHeaders() },
  );
}

// Mengubah status pembayaran pemesanan.
export async function patchAdminPembayaranStatus(
  idPemesanan: number,
  statusPembayaran: string,
) {
  return axios.patch(
    `${API_URL}/admin/pemesanan/${idPemesanan}/status-pembayaran`,
    { status_pembayaran: statusPembayaran },
    { headers: getAuthHeaders() },
  );
}

// Mengambil daftar mekanik untuk dropdown assign.
export async function fetchAdminMekaniks() {
  const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
    headers: getAuthHeaders(),
  });

  // Backend mengirim list di data.data.
  return (data.data || []) as Mekanik[];
}

// Menugaskan mekanik ke pemesanan.
export async function assignMekanikToPemesanan(
  idPemesanan: number,
  idMekanik: number,
) {
  return axios.patch(
    `${API_URL}/admin/pemesanan/${idPemesanan}/tugaskan-mekanik`,
    { id_mekanik: idMekanik },
    { headers: getAuthHeaders() },
  );
}

