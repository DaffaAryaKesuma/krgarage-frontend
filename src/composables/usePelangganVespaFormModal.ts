import { reactive, watch, type Ref } from "vue";

export interface VespaFormInitialData {
  id?: number | null;
  model: string;
  tahun_produksi: number | null;
  plat_nomor: string;
}

export interface VespaFormPayload {
  id?: number | null;
  model: string;
  tahun_produksi: number | null;
  plat_nomor: string;
}

type VespaFieldKey = "model" | "tahun_produksi" | "plat_nomor";

const CURRENT_YEAR = new Date().getFullYear();

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

export function usePelangganVespaFormModal(
  initialDataRef: Ref<VespaFormInitialData | undefined>,
) {
  const form = reactive({
    id: null as number | null,
    model: "",
    tahun_produksi: null as number | null,
    plat_nomor: "",
  });

  const errors = reactive({
    model: "",
    tahun_produksi: "",
    plat_nomor: "",
  });

  const touched = reactive({
    model: false,
    tahun_produksi: false,
    plat_nomor: false,
  });

  const resetFormAndValidation = () => {
    form.id = null;
    form.model = "";
    form.tahun_produksi = null;
    form.plat_nomor = "";

    (Object.keys(touched) as VespaFieldKey[]).forEach((key) => {
      touched[key] = false;
      errors[key] = "";
    });
  };

  const validateField = (field: VespaFieldKey) => {
    if (!touched[field]) return;

    let errorMsg = "";

    if (field === "model") {
      const str = String(form.model || "").trim();
      if (!str) errorMsg = VALIDATION_RULES.model.required;
      else if (str.length < VALIDATION_RULES.model.minLength.value)
        errorMsg = VALIDATION_RULES.model.minLength.message;
      else if (str.length > VALIDATION_RULES.model.maxLength.value)
        errorMsg = VALIDATION_RULES.model.maxLength.message;
    }

    if (field === "plat_nomor") {
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
      if (!form.tahun_produksi)
        errorMsg = VALIDATION_RULES.tahun_produksi.required;
      else if (form.tahun_produksi < VALIDATION_RULES.tahun_produksi.min.value)
        errorMsg = VALIDATION_RULES.tahun_produksi.min.message;
      else if (form.tahun_produksi > VALIDATION_RULES.tahun_produksi.max.value)
        errorMsg = VALIDATION_RULES.tahun_produksi.max.message;
    }

    errors[field] = errorMsg;
  };

  const validateAll = () => {
    (Object.keys(touched) as VespaFieldKey[]).forEach((key) => {
      touched[key] = true;
      validateField(key);
    });

    return !Object.values(errors).some((err) => err);
  };

  const handleSubmit = (): VespaFormPayload | null => {
    if (!validateAll()) {
      return null;
    }

    return {
      id: form.id,
      model: form.model,
      tahun_produksi: form.tahun_produksi,
      plat_nomor: form.plat_nomor,
    };
  };

  watch(
    initialDataRef,
    (newData) => {
      if (newData) {
        form.id = newData.id || null;
        form.model = newData.model || "";
        form.tahun_produksi = newData.tahun_produksi || null;
        form.plat_nomor = newData.plat_nomor || "";
        return;
      }

      resetFormAndValidation();
    },
    { immediate: true, deep: true },
  );

  return {
    form,
    errors,
    touched,
    maxProductionYear: VALIDATION_RULES.tahun_produksi.max.value,
    validateField,
    handleSubmit,
  };
}
