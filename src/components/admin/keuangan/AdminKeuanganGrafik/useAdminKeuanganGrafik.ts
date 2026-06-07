import { ref, watch, onMounted, onBeforeUnmount } from "vue";
// Chart.js dipakai untuk grafik pendapatan bulanan.
import { Chart, registerables } from "chart.js";
import { toIDR } from "@/utils/money";
import { MONTH_NAMES } from "@/utils/dateFilters";

// Daftarkan semua komponen Chart.js yang dibutuhkan.
Chart.register(...registerables);

// Composable grafik laporan keuangan.
export function useAdminKeuanganGrafik(
  getMonthlyData: () => Array<{ bulan: number; pendapatan: string }>,
) {
  // Ref canvas tempat Chart.js menggambar grafik.
  const kanvasGrafik = ref<HTMLCanvasElement | null>(null);
  // Instance chart disimpan agar bisa dihancurkan sebelum render ulang.
  let instansiGrafik: Chart | null = null;

  // Mengubah data bulanan backend menjadi array 12 bulan.
  const getChartData = () =>
    MONTH_NAMES.map((_, index) => {
      const monthData = getMonthlyData().find((d) => d.bulan === index + 1);
      return monthData ? parseFloat(monthData.pendapatan) : 0;
    });

  // Render ulang grafik.
  const renderChart = () => {
    if (!kanvasGrafik.value) return;

    // Hancurkan instance lama agar tidak menumpuk canvas/event.
    instansiGrafik?.destroy();

    instansiGrafik = new Chart(kanvasGrafik.value, {
      type: "bar",
      data: {
        labels: MONTH_NAMES,
        datasets: [
          {
            label: "Pendapatan",
            data: getChartData(),
            backgroundColor: "#ef4444",
            borderColor: "#dc2626",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => toIDR(context.parsed.y || 0),
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#f3f4f6" },
            ticks: {
              font: { size: window.innerWidth < 640 ? 10 : 12 },
              callback: (value) => toIDR(value as number),
            },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: window.innerWidth < 640 ? 10 : 12 } },
          },
        },
      },
    });
  };

  // Render ulang jika data bulanan berubah.
  watch(getMonthlyData, renderChart, { deep: true });

  // Render pertama kali saat komponen mounted.
  onMounted(() => renderChart());

  // Bersihkan chart saat komponen unmount.
  onBeforeUnmount(() => instansiGrafik?.destroy());

  // Ref canvas dikirim ke komponen .vue.
  return { kanvasGrafik };
}
