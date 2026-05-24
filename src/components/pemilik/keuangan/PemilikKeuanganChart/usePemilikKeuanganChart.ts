export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
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
      beginAtZero: true,
      ticks: {
        callback: (value: any) => "Rp " + (value / 1000).toFixed(0) + "k",
      },
      grid: { color: "rgba(0, 0, 0, 0.05)" },
    },
    x: { grid: { display: false } },
  },
};
