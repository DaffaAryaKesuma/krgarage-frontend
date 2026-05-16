import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { Mekanik } from "@/composables/helpers/adminPemesananControlPanelHelpers";

export async function patchAdminPemesananStatus(
  pemesananId: number,
  status: string,
  catatan?: string,
) {
  const payload: any = { status };
  if (catatan) {
    payload.catatan_mekanik = catatan;
  }

  return axios.patch(
    `${API_URL}/admin/pemesanan/${pemesananId}/status`,
    payload,
    { headers: getAuthHeaders() },
  );
}

export async function patchAdminPembayaranStatus(
  pemesananId: number,
  statusPembayaran: string,
) {
  return axios.patch(
    `${API_URL}/admin/pemesanan/${pemesananId}/status-pembayaran`,
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
  pemesananId: number,
  mekanikId: number,
) {
  return axios.patch(
    `${API_URL}/admin/pemesanan/${pemesananId}/tugaskan-mekanik`,
    { id_mekanik: mekanikId },
    { headers: getAuthHeaders() },
  );
}

