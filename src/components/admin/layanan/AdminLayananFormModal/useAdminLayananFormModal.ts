import { computed, watch } from "vue";
import { scrollLock } from "@/composables/scrollLock";

export interface LayananFormData {
  id: number | null;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan: number | null;
  gambarFile: File | null;
}

const FILE_INPUT_ID = "file_input";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function useAdminLayananFormModal(
  props: { show: boolean; mode: "add" | "edit"; form: LayananFormData; previewImage: string | null },
  emit: (e: string, ...args: any[]) => void,
) {
  scrollLock(() => props.show);

  const formTitle = computed(() =>
    props.mode === "add" ? "Tambah Layanan Baru" : "Edit Layanan",
  );

  const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("Ukuran file terlalu besar (maksimal 2MB)");
      return;
    }

    emit("fileChange", file);
  };

  watch(
    () => props.show,
    (newVal) => {
      if (!newVal) {
        const fileInput = document.getElementById(FILE_INPUT_ID) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    },
  );

  return { formTitle, handleFileChange, FILE_INPUT_ID };
}
