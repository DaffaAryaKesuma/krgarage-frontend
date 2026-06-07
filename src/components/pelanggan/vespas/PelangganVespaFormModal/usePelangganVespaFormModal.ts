import { reactive, watch, type Ref } from "vue";
import { formatPlatNomor } from "@/utils/format";

// Data awal yang dipakai saat modal berada dalam mode edit.
export interface VespaFormInitialData {
  id?: number | null;
  model: string;
  tahun_produksi: number | null;
  plat_nomor: string;
}

// Payload yang dikirim ke parent setelah form valid.
export interface VespaFormPayload {
  id?: number | null;
  model: string;
  tahun_produksi: number | null;
  plat_nomor: string;
}

// Daftar nama field yang boleh divalidasi.
type VespaFieldKey = "model" | "tahun_produksi" | "plat_nomor";

// Tahun saat ini dipakai untuk membuat batas maksimal tahun produksi.
const CURRENT_YEAR = new Date().getFullYear();

// Semua pesan dan batas validasi form Vespa dikumpulkan di sini.
const VALIDATION_RULES = {
  model: {
    required: "Model vespa harus diisi",
    minLength: { value: 2, message: "Model vespa minimal 2 karakter" },
    maxLength: { value: 50, message: "Model vespa maksimal 50 karakter" },
  },
  tahun_produksi: {
    required: "Tahun Produksi vespa harus diisi",
    min: { value: 1946, message: "Tahun Produksi vespa minimal 1946" },
    max: {
      value: CURRENT_YEAR + 1,
      message: `Tahun Produksi vespa maksimal ${CURRENT_YEAR + 1}`,
    },
  },
  plat_nomor: {
    required: "Plat Nomor harus diisi",
    minLength: { value: 3, message: "Plat Nomor minimal 3 karakter" },
    maxLength: { value: 15, message: "Plat Nomor maksimal 15 karakter" },
    pattern: {
      value: /^[A-Z0-9\s]+$/i,
      message: "Plat Nomor hanya boleh mengandung huruf dan angka",
    },
  },
};

// Composable untuk mengatur form tambah/edit Vespa pelanggan.
export function usePelangganVespaFormModal(
  initialDataRef: Ref<VespaFormInitialData | undefined>,
) {
  // State utama input form.
  const form = reactive({
    id: null as number | null,
    model: "",
    tahun_produksi: null as number | null,
    plat_nomor: "",
  });

  // Menyimpan pesan error setiap field.
  const errors = reactive({
    model: "",
    tahun_produksi: "",
    plat_nomor: "",
  });

  // Menandai field yang sudah disentuh pengguna.
  const touched = reactive({
    model: false,
    tahun_produksi: false,
    plat_nomor: false,
  });

  // Mengosongkan isi form sekaligus menghapus error dan touched.
  const resetFormAndValidation = () => {
    form.id = null;
    form.model = "";
    form.tahun_produksi = null;
    form.plat_nomor = "";

    (Object.keys(touched) as VespaFieldKey[]).forEach((key) => {
      // Field dianggap belum disentuh lagi setelah form direset.
      touched[key] = false;
      // Error lama dibersihkan agar tidak terbawa ke modal berikutnya.
      errors[key] = "";
    });
  };

  // Memvalidasi satu field sesuai aturan VALIDATION_RULES.
  const validateField = (field: VespaFieldKey) => {
    // Jika field belum disentuh, error tidak langsung ditampilkan.
    if (!touched[field]) return;

    // Pesan error sementara, nanti disimpan ke errors[field].
    let errorMsg = "";

    if (field === "model") {
      // Model wajib diisi dan panjangnya dibatasi.
      const str = String(form.model || "").trim();
      if (!str) errorMsg = VALIDATION_RULES.model.required;
      else if (str.length < VALIDATION_RULES.model.minLength.value)
        errorMsg = VALIDATION_RULES.model.minLength.message;
      else if (str.length > VALIDATION_RULES.model.maxLength.value)
        errorMsg = VALIDATION_RULES.model.maxLength.message;
    }

    if (field === "plat_nomor") {
      // Plat nomor wajib diisi, panjangnya dibatasi, dan hanya boleh huruf/angka/spasi.
      const str = String(form.plat_nomor || "").trim();
      if (!str) errorMsg = VALIDATION_RULES.plat_nomor.required;
      else if (str.length < VALIDATION_RULES.plat_nomor.minLength.value)
        errorMsg = VALIDATION_RULES.plat_nomor.minLength.message;
      else if (str.length > VALIDATION_RULES.plat_nomor.maxLength.value)
        errorMsg = VALIDATION_RULES.plat_nomor.maxLength.message;
      else if (!VALIDATION_RULES.plat_nomor.pattern.value.test(str))
        errorMsg = VALIDATION_RULES.plat_nomor.pattern.message;
    }

    if (field === "tahun_produksi") {
      // Tahun produksi wajib diisi dan harus berada di rentang yang masuk akal.
      if (!form.tahun_produksi)
        errorMsg = VALIDATION_RULES.tahun_produksi.required;
      else if (form.tahun_produksi < VALIDATION_RULES.tahun_produksi.min.value)
        errorMsg = VALIDATION_RULES.tahun_produksi.min.message;
      else if (form.tahun_produksi > VALIDATION_RULES.tahun_produksi.max.value)
        errorMsg = VALIDATION_RULES.tahun_produksi.max.message;
    }

    // Simpan hasil validasi field.
    errors[field] = errorMsg;
  };

  // Memvalidasi semua field saat tombol simpan ditekan.
  const validateAll = () => {
    (Object.keys(touched) as VespaFieldKey[]).forEach((key) => {
      // Semua field dianggap disentuh agar error bisa muncul.
      touched[key] = true;
      validateField(key);
    });

    // Form valid jika tidak ada pesan error.
    return !Object.values(errors).some((err) => err);
  };

  // Membuat payload final jika seluruh form valid.
  const handleSubmit = (): VespaFormPayload | null => {
    if (!validateAll()) {
      return null;
    }

    return {
      id: form.id,
      model: form.model,
      tahun_produksi: form.tahun_produksi,
      // Plat nomor dirapikan sebelum dikirim ke parent/API.
      plat_nomor: formatPlatNomor(form.plat_nomor),
    };
  };

  // Saat data awal berubah, isi form ikut berubah.
  watch(
    initialDataRef,
    (newData) => {
      if (newData) {
        // Mode edit: isi form dari data Vespa lama.
        form.id = newData.id || null;
        form.model = newData.model || "";
        form.tahun_produksi = newData.tahun_produksi || null;
        form.plat_nomor = newData.plat_nomor
          ? formatPlatNomor(newData.plat_nomor)
          : "";
        return;
      }

      // Mode tambah: form dikosongkan.
      resetFormAndValidation();
    },
    { immediate: true, deep: true },
  );

  // Nilai dan fungsi ini dipakai oleh file .vue modal.
  return {
    form,
    errors,
    touched,
    maxProductionYear: VALIDATION_RULES.tahun_produksi.max.value,
    validateField,
    handleSubmit,
  };
}
