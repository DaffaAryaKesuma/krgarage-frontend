import { ref, onMounted } from "vue";

type StatistikConfigItem = {
  target: number;
  label: string;
  suffix: string;
};

type StatistikAnimatedItem = StatistikConfigItem & {
  value: number;
};

const STATISTIK_CONFIG: StatistikConfigItem[] = [
  { target: 10, label: "Tahun Pengalaman", suffix: "+" },
  { target: 5, label: "Penghargaan Balap", suffix: "+" },
  { target: 500, label: "Pelanggan Terlayani", suffix: "+" },
  { target: 100, label: "Spesialis Vespa", suffix: "%" },
];

export function useBerandaStatistik() {
  const statistik = ref<StatistikAnimatedItem[]>(
    STATISTIK_CONFIG.map((s) => ({ ...s, value: 0 })),
  );
  const sectionRef = ref<HTMLElement | null>(null);

  const animateStatistik = () => {
    statistik.value.forEach((stat) => {
      const duration = 2000;
      const increment = stat.target / (duration / 16);
      const timer = setInterval(() => {
        if (stat.value < stat.target) {
          stat.value = Math.min(stat.value + increment, stat.target);
        } else {
          stat.value = stat.target;
          clearInterval(timer);
        }
      }, 16);
    });
  };

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStatistik();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );

    if (sectionRef.value) observer.observe(sectionRef.value);
  });

  return { statistik, sectionRef };
}
