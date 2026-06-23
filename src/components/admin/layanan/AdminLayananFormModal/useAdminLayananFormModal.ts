import { computed, ref, watch } from "vue";
// Lock scroll saat modal layanan terbuka.
import { scrollLock } from "@/composables/scrollLock";
import {
  getFormInputClass,
  getFormTextareaClass,
} from "@/utils/formVariants";

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
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

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
  type FieldName =
    | "nama_layanan"
    | "deskripsi"
    | "harga"
    | "durasi_pengerjaan";

  const errors = ref<Record<FieldName | "gambar", string>>({
    nama_layanan: "",
    deskripsi: "",
    harga: "",
    durasi_pengerjaan: "",
    gambar: "",
  });
  const touched = ref<Record<FieldName, boolean>>({
    nama_layanan: false,
    deskripsi: false,
    harga: false,
    durasi_pengerjaan: false,
  });

  const validateField = (field: FieldName): boolean => {
    const value = props.form[field];

    if (field === "nama_layanan") {
      errors.value[field] = String(value).trim()
        ? ""
        : "Nama layanan wajib diisi.";
    } else if (field === "deskripsi") {
      errors.value[field] = String(value).trim()
        ? ""
        : "Deskripsi layanan wajib diisi.";
    } else if (field === "harga") {
      errors.value[field] =
        value === null || Number.isNaN(Number(value))
          ? "Estimasi harga wajib diisi."
          : Number(value) < 0
            ? "Estimasi harga tidak boleh kurang dari 0."
            : !Number.isInteger(Number(value))
              ? "Estimasi harga harus berupa bilangan bulat."
              : "";
    } else {
      errors.value[field] =
        value === null
          ? ""
          : !Number.isInteger(Number(value)) || Number(value) < 5
            ? "Estimasi waktu minimal 5 menit dan harus berupa bilangan bulat."
            : "";
    }

    return !errors.value[field];
  };

  const handleBlur = (field: FieldName) => {
    touched.value[field] = true;
    validateField(field);
  };

  const handleInput = (field: FieldName) => {
    if (touched.value[field]) validateField(field);
  };

  const getInputClass = (field: FieldName) =>
    getFormInputClass(touched.value[field] && Boolean(errors.value[field]));
  const getTextareaClass = () =>
    getFormTextareaClass(
      touched.value.deskripsi && Boolean(errors.value.deskripsi),
    );

  const handleSubmit = () => {
    const fields: FieldName[] = [
      "nama_layanan",
      "deskripsi",
      "harga",
      "durasi_pengerjaan",
    ];
    fields.forEach((field) => {
      touched.value[field] = true;
      validateField(field);
    });
    if (fields.some((field) => errors.value[field]) || errors.value.gambar) {
      return;
    }
    emit("submit");
  };

  // Judul modal menyesuaikan mode add/edit.
  const formTitle = computed(() =>
    props.mode === "add" ? "Tambah Layanan Baru" : "Edit Layanan",
  );

  // Validasi file gambar lalu kirim file ke parent.
  const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.value.gambar = "Format gambar harus JPG, JPEG, PNG, atau GIF.";
      (event.target as HTMLInputElement).value = "";
      return;
    }

    // Cegah upload file terlalu besar.
    if (file.size > MAX_FILE_SIZE) {
      errors.value.gambar = "Ukuran gambar maksimal 2MB.";
      (event.target as HTMLInputElement).value = "";
      return;
    }

    errors.value.gambar = "";
    emit("fileChange", file);
  };

  // Reset input file saat modal ditutup.
  watch(
    () => props.show,
    (newVal) => {
      if (!newVal) {
        const fileInput = document.getElementById(FILE_INPUT_ID) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        errors.value = {
          nama_layanan: "",
          deskripsi: "",
          harga: "",
          durasi_pengerjaan: "",
          gambar: "",
        };
        touched.value = {
          nama_layanan: false,
          deskripsi: false,
          harga: false,
          durasi_pengerjaan: false,
        };
      }
    },
  );

  // State dan helper yang dipakai template.
  return {
    formTitle,
    handleFileChange,
    FILE_INPUT_ID,
    errors,
    touched,
    handleBlur,
    handleInput,
    getInputClass,
    getTextareaClass,
    handleSubmit,
  };
}
