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

  const vespaSaya = ref<VespaBasic[]>([]);
  const semuaLayanan = ref<LayananCatalogItem[]>([]);
  const sedangMemuat = ref(true);
  const sedangMengirim = ref(false);
  const slotTerpakai = ref<string[]>([]);

  const form = ref(createPelangganPemesananFormState());
  const errors = ref(createPelangganPemesananErrors());
  const touched = ref(createPelangganPemesananTouched());

  const layananTerpilih = computed(() =>
    semuaLayanan.value.filter((layanan) =>
      form.value.id_layanan.includes(layanan.id),
    ),
  );

  const vespaTerpilih = computed(() =>
    vespaSaya.value.find((vespa) => vespa.id === form.value.id_vespa),
  );

  const totalHarga = computed(() =>
    layananTerpilih.value.reduce((sum, layanan) => sum + layanan.harga, 0),
  );

  const validasiBidang = (field: PemesananFormField) => {
    validatePelangganPemesananField(
      field,
      form.value,
      touched.value,
      errors.value,
      slotTerpakai.value,
    );
  };

  const cekKetersediaan = async () => {
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
      slotTerpakai.value = (slots as string[]).map((time) =>
        time.substring(0, 5),
      );
    } catch (error: any) {
      logError(error, "cekKetersediaan");
      toast.error(handleApiError(error));
    }
  };

  const tanganiPerubahanLayanan = (layananIds: number[]) => {
    form.value.id_layanan = layananIds;
    touched.value.id_layanan = true;
    validasiBidang("id_layanan");
  };

  const tanganiPerubahanVespa = (vespaId: number) => {
    form.value.id_vespa = vespaId;
    touched.value.id_vespa = true;
    validasiBidang("id_vespa");
  };

  const tanganiPerubahanTanggal = async () => {
    await cekKetersediaan();
    touched.value.tanggal_pemesanan = true;
    validasiBidang("tanggal_pemesanan");
  };

  const tanganiPilihWaktu = () => {
    touched.value.jam_pemesanan = true;
    validasiBidang("jam_pemesanan");
  };

  const kirimData = async () => {
    if (sedangMengirim.value) return;

    const fieldsToValidate: PemesananFormField[] = [
      "id_vespa",
      "id_layanan",
      "tanggal_pemesanan",
      "jam_pemesanan",
    ];

    fieldsToValidate.forEach((field) => {
      touched.value[field] = true;
      validasiBidang(field);
    });

    if (hasPelangganPemesananErrors(errors.value)) {
      toast.error("Lengkapi semua field yang wajib");
      return;
    }

    sedangMengirim.value = true;

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
      logError(error, "kirimData");
      toast.error(handleApiError(error));
    } finally {
      sedangMengirim.value = false;
    }
  };

  const muatDataAwal = async () => {
    const headers = getAuthHeaders();
    if (!Object.keys(headers).length) {
      sedangMemuat.value = false;
      return;
    }

    try {
      const [vespas, layanan] = await Promise.all([
        axios.get(`${API_URL}/vespa-saya`, { headers }),
        axios.get(`${API_URL}/layanan`),
      ]);

      vespaSaya.value = vespas.data.data ?? vespas.data;
      semuaLayanan.value = layanan.data.data ?? layanan.data;
    } catch (error: any) {
      logError(error, "muatDataAwal");
      toast.error(handleApiError(error));
    } finally {
      sedangMemuat.value = false;
    }
  };

  return {
    TIME_SLOTS,
    myVespas: vespaSaya,
    allLayanan: semuaLayanan,
    isLoading: sedangMemuat,
    isSubmitting: sedangMengirim,
    bookedSlots: slotTerpakai,
    form,
    errors,
    touched,
    selectedLayanan: layananTerpilih,
    selectedVespa: vespaTerpilih,
    totalHarga,
    handleLayananChange: tanganiPerubahanLayanan,
    handleVespaChange: tanganiPerubahanVespa,
    handleDateChange: tanganiPerubahanTanggal,
    handleTimeSelect: tanganiPilihWaktu,
    submit: kirimData,
    loadInitialData: muatDataAwal,
  };
}
