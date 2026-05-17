import { computed, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { LayananCatalogItem } from "@/types/layanan";
import type { VespaBasic } from "@/types/vespa";
import {
  buildPelangganPemesananPayload,
  createPelangganPemesananErrors,
  createPelangganPemesananFormState,
  createPelangganPemesananTouched,
  hasPelangganPemesananErrors,
  validatePelangganPemesananField,
  type PemesananFormField,
} from "@/composables/helpers/pelangganPemesananHelpers";

export const TIME_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function usePelangganPemesananPage() {
  const router = useRouter();
  const toast = useToast();

  const myVespas = ref<VespaBasic[]>([]);
  const allLayanan = ref<LayananCatalogItem[]>([]);
  const isLoading = ref(true);
  const isSubmitting = ref(false);
  const bookedSlots = ref<string[]>([]);

  const form = ref(createPelangganPemesananFormState());
  const errors = ref(createPelangganPemesananErrors());
  const touched = ref(createPelangganPemesananTouched());

  const selectedLayanan = computed(() =>
    allLayanan.value.filter((layanan) =>
      form.value.id_layanan.includes(layanan.id),
    ),
  );

  const selectedVespa = computed(() =>
    myVespas.value.find((v) => v.id === form.value.id_vespa),
  );

  const totalHarga = computed(() =>
    selectedLayanan.value.reduce((sum, layanan) => sum + layanan.harga, 0),
  );

  const validateField = (field: PemesananFormField) => {
    validatePelangganPemesananField(
      field,
      form.value,
      touched.value,
      errors.value,
      bookedSlots.value,
    );
  };

  const checkAvailability = async () => {
    if (!form.value.tanggal_pemesanan) return;

    const headers = getAuthHeaders();
    if (!Object.keys(headers).length) return;

    form.value.jam_pemesanan = "";
    try {
      const { data } = await axios.get(
        `${API_URL}/pemesanan/cek-slot?date=${form.value.tanggal_pemesanan}`,
        { headers },
      );
      // Data dari Laravel mengembalikan jam dengan format "15:00:00" (HH:mm:ss)
      // Kita perlu mengambil "HH:mm" (5 karakter pertama) agar cocok dengan TIME_SLOTS
      const slots = data.data ?? data;
      bookedSlots.value = (slots as string[]).map((time) =>
        time.substring(0, 5),
      );
    } catch (error: any) {
      logError(error, "checkAvailability");
      toast.error(handleApiError(error));
    }
  };

  const handleLayananChange = (layananIds: number[]) => {
    form.value.id_layanan = layananIds;
    touched.value.id_layanan = true;
    validateField("id_layanan");
  };

  const handleVespaChange = (vespaId: number) => {
    form.value.id_vespa = vespaId;
    touched.value.id_vespa = true;
    validateField("id_vespa");
  };

  const handleDateChange = async () => {
    await checkAvailability();
    touched.value.tanggal_pemesanan = true;
    validateField("tanggal_pemesanan");
  };

  const handleTimeSelect = () => {
    touched.value.jam_pemesanan = true;
    validateField("jam_pemesanan");
  };

  const submit = async () => {
    if (isSubmitting.value) return;

    const fieldsToValidate: PemesananFormField[] = [
      "id_vespa",
      "id_layanan",
      "tanggal_pemesanan",
      "jam_pemesanan",
    ];

    fieldsToValidate.forEach((field) => {
      touched.value[field] = true;
      validateField(field);
    });

    if (hasPelangganPemesananErrors(errors.value)) {
      toast.error("Lengkapi semua field yang wajib");
      return;
    }

    isSubmitting.value = true;

    try {
      const headers = getAuthHeaders();
      if (!Object.keys(headers).length) {
        return;
      }

      const payload = buildPelangganPemesananPayload(form.value);

      await axios.post(`${API_URL}/pemesanan`, payload, { headers });

      toast.success("Pemesanan berhasil! Silakan datang sesuai jadwal");
      setTimeout(() => {
        router.push("/app/riwayat");
      }, 1500);
    } catch (error: any) {
      logError(error, "submit");
      toast.error(handleApiError(error));
    } finally {
      isSubmitting.value = false;
    }
  };

  const loadInitialData = async () => {
    const headers = getAuthHeaders();
    if (!Object.keys(headers).length) {
      isLoading.value = false;
      return;
    }

    try {
      const [vespas, layanan] = await Promise.all([
        axios.get(`${API_URL}/vespa-saya`, { headers }),
        axios.get(`${API_URL}/layanan`),
      ]);

      myVespas.value = vespas.data.data ?? vespas.data;
      allLayanan.value = layanan.data.data ?? layanan.data;
    } catch (error: any) {
      logError(error, "loadInitialData");
      toast.error(handleApiError(error));
    } finally {
      isLoading.value = false;
    }
  };

  return {
    TIME_SLOTS,
    myVespas,
    allLayanan,
    isLoading,
    isSubmitting,
    bookedSlots,
    form,
    errors,
    touched,
    selectedLayanan,
    selectedVespa,
    totalHarga,
    handleLayananChange,
    handleVespaChange,
    handleDateChange,
    handleTimeSelect,
    submit,
    loadInitialData,
  };
}
