// Opsi konfigurasi Chart.js untuk grafik pendapatan pemilik.
export const CHART_OPTIONS = {
  // Grafik mengikuti ukuran container.
  responsive: true,
  // Tinggi grafik dikontrol oleh wrapper, bukan aspect ratio default.
  maintainAspectRatio: false,
  plugins: {
    // Legend disembunyikan karena grafik hanya satu fokus utama.
    legend: { display: false },
    // Tooltip mengubah angka menjadi format rupiah.
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      callbacks: {
        label: (context: any) =>
          "Rp " + context.parsed.y.toLocaleString("id-ID"),
      },
    },
  },
  scales: {
    y: {
      // Sumbu Y dimulai dari 0 agar tren tidak menipu secara visual.
      beginAtZero: true,
      ticks: {
        // Label sumbu Y dibuat pendek, contoh Rp 100k.
        callback: (value: any) => "Rp " + (value / 1000).toFixed(0) + "k",
      },
      grid: { color: "rgba(0, 0, 0, 0.05)" },
    },
    // Grid sumbu X disembunyikan agar tampilan lebih bersih.
    x: { grid: { display: false } },
  },
};
