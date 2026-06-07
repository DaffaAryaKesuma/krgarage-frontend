import { computed, ref, watch, type Ref } from "vue";

// Nama bulan untuk tampilan kalender.
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Nama hari pendek untuk header kalender.
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Membuat array tanggal dalam satu bulan, termasuk null untuk offset hari pertama.
const getDaysInMonth = (month: number, year: number) => {
  // Hari pertama bulan ini, 0 = Minggu.
  const firstDay = new Date(year, month, 1).getDay();
  // Jumlah hari dalam bulan.
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<number | null> = [];

  // Tambahkan null agar tanggal 1 jatuh di kolom hari yang benar.
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Tambahkan tanggal asli bulan tersebut.
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
};

// Composable logic kalender tanggal.
export function usePemilihTanggal(
  modelValueRef: Ref<string>,
  updateModelValue: (value: string) => void,
) {
  // Buka/tutup popup kalender.
  const showPemilih = ref(false);

  // Tanggal awal diambil dari modelValue, fallback hari ini.
  const initDate = new Date(modelValueRef.value || new Date());
  const currentMonth = ref(initDate.getMonth());
  const currentYear = ref(initDate.getFullYear());

  // Jika modelValue berubah dari parent, bulan dan tahun ikut sinkron.
  watch(modelValueRef, (newVal) => {
    if (!newVal) return;

    const parsedDate = new Date(newVal);
    currentMonth.value = parsedDate.getMonth();
    currentYear.value = parsedDate.getFullYear();
  });

  // Daftar tanggal yang ditampilkan di grid kalender.
  const calendarDays = computed(() =>
    getDaysInMonth(currentMonth.value, currentYear.value),
  );

  // Format tanggal untuk teks tombol.
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "Pilih tanggal";

    const date = new Date(dateStr);
    return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
  };

  // Memilih tanggal lalu update v-model parent.
  const selectDate = (day: number | null) => {
    if (!day) return;

    // Format output: YYYY-MM-DD.
    const y = currentYear.value;
    const m = String(currentMonth.value + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    updateModelValue(`${y}-${m}-${d}`);
    showPemilih.value = false;
  };

  // Mengubah bulan, termasuk pindah tahun jika melewati Januari/Desember.
  const changeMonth = (delta: number) => {
    currentMonth.value += delta;
    if (currentMonth.value > 11) {
      currentMonth.value = 0;
      currentYear.value++;
    } else if (currentMonth.value < 0) {
      currentMonth.value = 11;
      currentYear.value--;
    }
  };

  // Mengubah tahun.
  const changeYear = (delta: number) => {
    currentYear.value += delta;
  };

  // Mengecek apakah satu tanggal sedang terpilih.
  const isDateSelected = (day: number | null) => {
    if (!day || !modelValueRef.value) return false;

    const y = currentYear.value;
    const m = String(currentMonth.value + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}` === modelValueRef.value;
  };

  // Mengecek apakah satu tanggal adalah hari ini.
  const isToday = (day: number | null, month: number, year: number) => {
    if (!day) return false;

    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Delay penutupan agar klik tanggal di popup sempat diproses.
  const handleBlur = () => {
    window.setTimeout(() => {
      showPemilih.value = false;
    }, 200);
  };

  // Shortcut memilih hari ini.
  const setToday = () => {
    updateModelValue(new Date().toISOString().split("T")[0]);
    showPemilih.value = false;
  };

  // Semua state dan aksi kalender dikembalikan ke komponen .vue.
  return {
    showPemilih,
    currentMonth,
    currentYear,
    MONTHS,
    DAYS,
    calendarDays,
    formatDateDisplay,
    selectDate,
    changeMonth,
    changeYear,
    isDateSelected,
    isToday,
    handleBlur,
    setToday,
  };
}
