import { computed, ref, watch, type Ref } from "vue";

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

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const getDaysInMonth = (month: number, year: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<number | null> = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
};

export function useBaseDatePicker(
  modelValueRef: Ref<string>,
  updateModelValue: (value: string) => void,
) {
  const showPicker = ref(false);

  const initDate = new Date(modelValueRef.value || new Date());
  const currentMonth = ref(initDate.getMonth());
  const currentYear = ref(initDate.getFullYear());

  watch(modelValueRef, (newVal) => {
    if (!newVal) return;

    const parsedDate = new Date(newVal);
    currentMonth.value = parsedDate.getMonth();
    currentYear.value = parsedDate.getFullYear();
  });

  const calendarDays = computed(() =>
    getDaysInMonth(currentMonth.value, currentYear.value),
  );

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "Pilih tanggal";

    const date = new Date(dateStr);
    return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
  };

  const selectDate = (day: number | null) => {
    if (!day) return;

    const y = currentYear.value;
    const m = String(currentMonth.value + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    updateModelValue(`${y}-${m}-${d}`);
    showPicker.value = false;
  };

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

  const changeYear = (delta: number) => {
    currentYear.value += delta;
  };

  const isDateSelected = (day: number | null) => {
    if (!day || !modelValueRef.value) return false;

    const y = currentYear.value;
    const m = String(currentMonth.value + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}` === modelValueRef.value;
  };

  const isToday = (day: number | null, month: number, year: number) => {
    if (!day) return false;

    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      showPicker.value = false;
    }, 200);
  };

  const setToday = () => {
    updateModelValue(new Date().toISOString().split("T")[0]);
    showPicker.value = false;
  };

  return {
    showPicker,
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
