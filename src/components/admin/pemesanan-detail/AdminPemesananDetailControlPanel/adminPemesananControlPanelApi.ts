import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { Mekanik } from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/adminPemesananControlPanelHelpers";

export async function patchAdminPemesananStatus(
  idPemesanan: number,
  status: string,
  catatan?: string,
) {
  const payload: any = { status };
  if (catatan) {
    payload.catatan_mekanik = catatan;
  }

  return axios.patch(
    `${API_URL}/admin/pemesanan/${idPemesanan}/status`,
    payload,
    { headers: getAuthHeaders() },
  );
}

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

export async function fetchAdminMekaniks() {
  const { data } = await axios.get(`${API_URL}/admin/mekanik`, {
    headers: getAuthHeaders(),
  });

  return (data.data || []) as Mekanik[];
}

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

