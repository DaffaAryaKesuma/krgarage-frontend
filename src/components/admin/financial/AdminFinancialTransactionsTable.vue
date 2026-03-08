<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { toIDR } from "@/utils/money";

interface Service {
  nama_layanan: string;
  pivot: { harga_saat_pesan: number };
}

interface Booking {
  id: number;
  kode_pemesanan: string;
  updated_at: string;
  total_harga: number | null;
  pengguna: { nama: string };
  layanan: Service[];
  item_pemesanan?: Array<{
    jumlah: number;
    suku_cadang: { nama_suku_cadang: string };
  }>;
}

interface Props {
  bookings: Booking[];
}

defineProps<Props>();

const TABLE_HEADERS = [
  "Kode Pemesanan",
  "Tanggal",
  "Pelanggan",
  "Layanan",
  "Suku Cadang",
  "Total",
];

const calculateServiceTotal = (layanan: Service[]) =>
  layanan.reduce((sum, s) => sum + (s.pivot.harga_saat_pesan || 0), 0);

const getBookingServices = (layanan: Service[]) =>
  layanan.map((s) => s.nama_layanan).join(", ");

const getBookingItems = (items?: Booking["item_pemesanan"]) =>
  !items?.length
    ? "-"
    : items
        .map((item) => `${item.suku_cadang.nama_suku_cadang} (x${item.jumlah})`)
        .join(", ");

const getBookingTotal = (booking: Booking) =>
  booking.total_harga || calculateServiceTotal(booking.layanan);
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
  >
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Detail Transaksi</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in TABLE_HEADERS"
              :key="header"
              class="px-6 py-3 text-xs text-left font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="booking in bookings"
            :key="booking.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ booking.kode_pemesanan }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ formatDateShort(booking.updated_at) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ booking.pengguna.nama }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ getBookingServices(booking.layanan) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <span
                :class="
                  booking.item_pemesanan?.length ? '' : 'text-gray-400 italic'
                "
              >
                {{ getBookingItems(booking.item_pemesanan) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ toIDR(getBookingTotal(booking)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
