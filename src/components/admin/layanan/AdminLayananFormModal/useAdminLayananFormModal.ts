import { computed, watch } from "vue";
// Lock scroll saat modal layanan terbuka.
import { scrollLock } from "@/composables/scrollLock";

// Bentuk data form layanan.
export interface LayananFormData {
  id: number | null;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan: number | null;
  gambarFile: File | null;
}

// Id input file agar bisa di-reset manual saat modal ditutup.
const FILE_INPUT_ID = "file_input";
// Batas maksimal gambar layanan.
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Event modal form layanan.
export interface AdminLayananFormModalEmit {
  (e: "close"): void;
  (e: "submit"): void;
  (e: "update:form", value: LayananFormData): void;
  (e: "update:previewImage", value: string | null): void;
  (e: "fileChange", file: File): void;
}

// Composable logic modal tambah/edit layanan.
export function useAdminLayananFormModal(
  props: { show: boolean; mode: "add" | "edit"; form: LayananFormData; previewImage: string | null },
  emit: AdminLayananFormModalEmit,
) {
  // Lock scroll selama modal terbuka.
  scrollLock(() => props.show);

  // Judul modal menyesuaikan mode add/edit.
  const formTitle = computed(() =>
    props.mode === "add" ? "Tambah Layanan Baru" : "Edit Layanan",
  );

  // Validasi file gambar lalu kirim file ke parent.
  const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Cegah upload file terlalu besar.
    if (file.size > MAX_FILE_SIZE) {
      alert("Ukuran file terlalu besar (maksimal 2MB)");
      return;
    }

    emit("fileChange", file);
  };

  // Reset input file saat modal ditutup.
  watch(
    () => props.show,
    (newVal) => {
      if (!newVal) {
        const fileInput = document.getElementById(FILE_INPUT_ID) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    },
  );

  // State dan helper yang dipakai template.
  return { formTitle, handleFileChange, FILE_INPUT_ID };
}
