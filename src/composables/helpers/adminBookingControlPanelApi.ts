import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { Mekanik } from "@/composables/helpers/adminBookingControlPanelHelpers";

export async function patchAdminBookingStatus(
  bookingId: number,
  status: string,
) {
  return axios.patch(
    `${API_URL}/admin/pemesanan/${bookingId}/status`,
    { status },
    { headers: getAuthHeaders() },
  );
}

export async function patchAdminPaymentStatus(
  bookingId: number,
  statusPembayaran: string,
) {
  return axios.patch(
    `${API_URL}/admin/pemesanan/${bookingId}/status-pembayaran`,
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

export async function assignMekanikToBooking(
  bookingId: number,
  mekanikId: number,
) {
  return axios.patch(
    `${API_URL}/admin/pemesanan/${bookingId}/tugaskan-mekanik`,
    { id_mekanik: mekanikId },
    { headers: getAuthHeaders() },
  );
}
