// Mengambil ref untuk state reaktif.
import { ref } from "vue";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";
// Mengambil helper untuk mencatat error.
import { logError } from "@/utils/errorHandler";
// Mengambil helper format tanggal lokal YYYY-MM-DD.
import { toLocalISOString } from "@/utils/format";
// Mengambil helper refresh otomatis saat ada perubahan data.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
// Mengambil tipe data pemesanan keuangan.
import type { KeuanganPemesanan } from "@/types/pemesanan";
// Mengambil tipe data riwayat restok.
import type { RiwayatRestokSukuCadang } from "@/types/inventaris";
// Mengambil tipe tab laporan keuangan.
import type { PemilikKeuanganTabKey } from "@/components/pemilik/keuangan/PemilikKeuanganTabs/usePemilikKeuanganTabs";

// Opsi tambahan untuk fetch data.
interface FetchOptions {
  // Jika true, fetch berjalan diam-diam tanpa loading/reset halaman.
  silent?: boolean;
}

// Fungsi utama logika halaman laporan keuangan pemilik.
export function usePemilikKeuanganPage() {
  // Tanggal hari ini sebagai batas akhir default laporan.
  const today = new Date();
  // Tanggal satu bulan lalu sebagai batas awal default laporan.
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  // State tanggal awal filter.
  const startDate = ref(toLocalISOString(oneMonthAgo));
  // State tanggal akhir filter.
  const endDate = ref(toLocalISOString(today));
  
  // Data untuk grafik pendapatan.
  const revenueData = ref<any>({ labels: [], datasets: [] });
  // Daftar transaksi pemasukan.
  const pemesanan = ref<KeuanganPemesanan[]>([]);
  // Daftar pengeluaran restok.
  const pengeluaranRestok = ref<RiwayatRestokSukuCadang[]>([]);
  // Status loading halaman.
  const loading = ref(true);
  // Ringkasan angka laporan keuangan.
  const ringkasan = ref({
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    totalPemesanan: 0,
    totalRestok: 0,
    avgPemesanan: 0,
  });
  
  // Halaman aktif tabel pemasukan.
  const currentPage = ref(1);
  // Halaman aktif tabel pengeluaran.
  const expenseCurrentPage = ref(1);
  // Jumlah data per halaman tabel.
  const itemsPerPage = ref(10);
  // Tab aktif default adalah ringkasan.
  const activeTab = ref<PemilikKeuanganTabKey>("ringkasan");
  
  // Mengambil data laporan keuangan dari backend.
  const fetchKeuanganData = async (options: FetchOptions = {}) => {
    // Jika bukan silent, tampilkan loading dan reset halaman tabel.
    if (!options.silent) {
      loading.value = true;
      currentPage.value = 1;
      expenseCurrentPage.value = 1;
    }
    try {
      // Ambil header token.
      const headers = getAuthHeaders();
      // Parameter tanggal yang dikirim ke API.
      const params = {
        start_date: startDate.value,
        end_date: endDate.value,
      };
      
      // Ambil tren pendapatan, transaksi, dan pengeluaran restok sekaligus.
      const [trendRes, pemesananRes, restokRes] = await Promise.all([
        axios.get(`${API_URL}/pemilik/tren-pendapatan`, { headers, params }),
        axios.get(`${API_URL}/pemilik/transaksi`, { headers, params }),
        axios.get(`${API_URL}/pemilik/pengeluaran-restok`, { headers, params }),
      ]);
      
      // Ambil data trend dari response API.
      const trendData = trendRes.data.data || trendRes.data;
      // Bentuk data grafik Chart.js.
      revenueData.value = {
        labels: trendData.labels || [],
        datasets: [
          {
            label: `Pendapatan`,
            data: trendData.values || [],
            borderColor: "rgb(220, 38, 38)",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };

      // Simpan daftar transaksi pemasukan.
      const pemesananData = pemesananRes.data.data || pemesananRes.data;
      pemesanan.value = Array.isArray(pemesananData) ? pemesananData : [];
      // Simpan daftar pengeluaran restok.
      const restokData = restokRes.data.data || restokRes.data;
      pengeluaranRestok.value = Array.isArray(restokData) ? restokData : [];

      // Hitung total pemasukan dari transaksi.
      const total = pemesanan.value.reduce((sum, b) => sum + Number(b.total_harga || 0), 0);
      // Hitung total pengeluaran dari restok.
      const totalExpense = pengeluaranRestok.value.reduce(
        (sum, item) => sum + Number(item.total_pengeluaran || 0),
        0,
      );

      // Simpan ringkasan laporan keuangan.
      ringkasan.value = {
        totalRevenue: total,
        totalExpense,
        netProfit: total - totalExpense,
        totalPemesanan: pemesanan.value.length,
        totalRestok: pengeluaranRestok.value.length,
        avgPemesanan: pemesanan.value.length > 0 ? total / pemesanan.value.length : 0,
      };
    } catch (error: any) {
      // Catat error dan kosongkan data agar tampilan tidak memakai data lama.
      logError(error, "fetchKeuanganData");
      pemesanan.value = [];
      pengeluaranRestok.value = [];
      revenueData.value = { labels: [], datasets: [] };
      ringkasan.value = {
        totalRevenue: 0,
        totalExpense: 0,
        netProfit: 0,
        totalPemesanan: 0,
        totalRestok: 0,
        avgPemesanan: 0,
      };
    } finally {
      // Jika bukan silent, matikan loading.
      if (!options.silent) {
        loading.value = false;
      }
    }
  };

  // Refresh laporan diam-diam saat ada perubahan data.
  useRealtimeRefresh(() => fetchKeuanganData({ silent: true }));
  
  // Kembalikan state dan fungsi agar bisa dipakai oleh file .vue.
  return {
    startDate,
    endDate,
    revenueData,
    pemesanan,
    pengeluaranRestok,
    loading,
    ringkasan,
    currentPage,
    expenseCurrentPage,
    itemsPerPage,
    activeTab,
    fetchKeuanganData
  };
}
