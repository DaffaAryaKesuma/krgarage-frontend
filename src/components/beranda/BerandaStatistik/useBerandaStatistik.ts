// ref untuk data animasi dan element section, onMounted untuk setup observer.
import { ref, onMounted } from "vue";

// Konfigurasi awal statistik.
type StatistikConfigItem = {
  target: number;
  label: string;
  suffix: string;
};

// Item statistik yang sudah punya value animasi.
type StatistikAnimatedItem = StatistikConfigItem & {
  value: number;
};

// Data statistik landing page bersifat statis.
const STATISTIK_CONFIG: StatistikConfigItem[] = [
  { target: 10, label: "Tahun Pengalaman", suffix: "+" },
  { target: 5, label: "Penghargaan Balap", suffix: "+" },
  { target: 500, label: "Pelanggan Terlayani", suffix: "+" },
  { target: 100, label: "Spesialis Vespa", suffix: "%" },
];

// Composable untuk animasi angka statistik saat section terlihat.
export function useBerandaStatistik() {
  // Value awal dibuat 0 agar bisa dianimasikan ke target.
  const statistik = ref<StatistikAnimatedItem[]>(
    STATISTIK_CONFIG.map((s) => ({ ...s, value: 0 })),
  );
  // Ref DOM section dipakai oleh IntersectionObserver.
  const sectionRef = ref<HTMLElement | null>(null);

  // Menjalankan animasi angka naik sampai target.
  const animateStatistik = () => {
    statistik.value.forEach((stat) => {
      // Durasi animasi 2 detik.
      const duration = 2000;
      // 16ms kira-kira satu frame pada 60fps.
      const increment = stat.target / (duration / 16);
      const timer = setInterval(() => {
        if (stat.value < stat.target) {
          // Naikkan value tetapi jangan lewat target.
          stat.value = Math.min(stat.value + increment, stat.target);
        } else {
          // Pastikan angka berhenti tepat di target.
          stat.value = stat.target;
          clearInterval(timer);
        }
      }, 16);
    });
  };

  // Observer mulai bekerja setelah komponen dimount.
  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animasi hanya dijalankan saat section masuk viewport.
            animateStatistik();
            // Observer dihentikan agar animasi tidak berulang.
            observer.disconnect();
          }
        });
      },
      // threshold 0.5 berarti minimal setengah section terlihat.
      { threshold: 0.5 },
    );

    // Mulai amati section jika element sudah tersedia.
    if (sectionRef.value) observer.observe(sectionRef.value);
  });

  // statistik untuk ditampilkan, sectionRef dipasang di template.
  return { statistik, sectionRef };
}
