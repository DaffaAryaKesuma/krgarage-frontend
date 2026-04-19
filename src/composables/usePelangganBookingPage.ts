import { computed, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { ServiceCatalogItem } from "@/types/service";
import type { VespaBasic } from "@/types/vespa";
import {
  buildPelangganBookingPayload,
  createPelangganBookingErrors,
  createPelangganBookingFormState,
  createPelangganBookingTouched,
  hasPelangganBookingErrors,
  validatePelangganBookingField,
  type BookingFormField,
} from "@/composables/helpers/pelangganBookingHelpers";

export const TIME_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function usePelangganBookingPage() {
  const router = useRouter();
  const toast = useToast();

  const myVespas = ref<VespaBasic[]>([]);
  const allServices = ref<ServiceCatalogItem[]>([]);
  const isLoading = ref(true);
  const isSubmitting = ref(false);
  const bookedSlots = ref<string[]>([]);

  const form = ref(createPelangganBookingFormState());
  const errors = ref(createPelangganBookingErrors());
  const touched = ref(createPelangganBookingTouched());

  const selectedServices = computed(() =>
    allServices.value.filter((service) =>
      form.value.service_ids.includes(service.id),
    ),
  );

  const totalHarga = computed(() =>
    selectedServices.value.reduce((sum, service) => sum + service.harga, 0),
  );

  const validateField = (field: BookingFormField) => {
    validatePelangganBookingField(
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
      bookedSlots.value = data;
    } catch (error: any) {
      logError(error, "checkAvailability");
      toast.error(handleApiError(error));
    }
  };

  const handleServiceChange = (serviceIds: number[]) => {
    form.value.service_ids = serviceIds;
    touched.value.service_ids = true;
    validateField("service_ids");
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

    const fieldsToValidate: BookingFormField[] = [
      "id_vespa",
      "service_ids",
      "tanggal_pemesanan",
      "jam_pemesanan",
    ];

    fieldsToValidate.forEach((field) => {
      touched.value[field] = true;
      validateField(field);
    });

    if (hasPelangganBookingErrors(errors.value)) {
      toast.error("Lengkapi semua field yang wajib");
      return;
    }

    isSubmitting.value = true;

    try {
      const headers = getAuthHeaders();
      if (!Object.keys(headers).length) {
        return;
      }

      const payload = buildPelangganBookingPayload(form.value);

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
      const [vespas, services] = await Promise.all([
        axios.get(`${API_URL}/vespa-saya`, { headers }),
        axios.get(`${API_URL}/layanan`),
      ]);

      myVespas.value = vespas.data;
      allServices.value = services.data;
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
    allServices,
    isLoading,
    isSubmitting,
    bookedSlots,
    form,
    errors,
    touched,
    totalHarga,
    handleServiceChange,
    handleVespaChange,
    handleDateChange,
    handleTimeSelect,
    submit,
    loadInitialData,
  };
}
