import axios from "axios";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type {
  InventorySparepart,
  InventorySparepartForm,
} from "@/types/inventory";

export async function fetchAdminInventorySpareparts() {
  const { data } = await axios.get(`${API_URL}/admin/inventori`, {
    headers: getAuthHeaders(),
  });

  return (data.data || []) as InventorySparepart[];
}

export function createAdminInventorySparepart(payload: InventorySparepartForm) {
  return axios.post(`${API_URL}/admin/inventori`, payload, {
    headers: getAuthHeaders(),
  });
}

export function updateAdminInventorySparepart(
  sparepartId: number,
  payload: InventorySparepartForm,
) {
  return axios.put(`${API_URL}/admin/inventori/${sparepartId}`, payload, {
    headers: getAuthHeaders(),
  });
}

export function restockAdminInventorySparepart(
  sparepartId: number,
  quantity: number,
) {
  return axios.post(
    `${API_URL}/admin/inventori/${sparepartId}/tambah-stok`,
    { jumlah: quantity },
    { headers: getAuthHeaders() },
  );
}

export function deleteAdminInventorySparepart(sparepartId: number) {
  return axios.delete(`${API_URL}/admin/inventori/${sparepartId}`, {
    headers: getAuthHeaders(),
  });
}
