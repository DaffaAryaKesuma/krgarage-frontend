// Mengambil computed untuk data turunan dan ref untuk data reaktif.
import { computed, ref } from "vue";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil router untuk pindah halaman setelah pemesanan berhasil.
import { useRouter } from "vue-router";
// Mengambil toast untuk pesan sukses/error.
import { useToast } from "@/utils/useToast";
// Mengambil helper error.
import { handleApiError, logError } from "@/utils/errorHandler";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil tipe data layanan.
import type { LayananCatalogItem } from "@/types/layanan";
// Mengambil tipe data Vespa sederhana.
import type { VespaBasic } from "@/types/vespa";
// Mengambil helper state, validasi, dan payload form pemesanan.
import {
  buildPelangganPemesananPayload,
  createPelangganPemesananErrors,
  createPelangganPemesananFormState,
  createPelangganPemesananTouched,
  hasPelangganPemesananErrors,
  validatePelangganPemesananField,
  type PemesananFormField,
} from "@/pages/pelanggan/PelangganPemesananPage/pelangganPemesananHelpers";

// Daftar jam servis yang bisa dipilih pelanggan.
export const TIME_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Fungsi utama logika halaman pemesanan pelanggan.
export function usePelangganPemesananPage() {
  // Router dipakai untuk pindah ke halaman riwayat setelah berhasil.
  const router = useRouter();
  // Toast dipakai untuk menampilkan pesan.
  const toast = useToast();

  // Daftar Vespa milik pelanggan.
  const vespaSaya = ref<VespaBasic[]>([]);
  // Daftar semua layanan servis.
  const semuaLayanan = ref<LayananCatalogItem[]>([]);
  // Status loading data awal.
  const sedangMemuat = ref(true);
  // Status saat submit sedang berjalan.
  const sedangMengirim = ref(false);
  // Daftar jam yang sudah terpakai pada tanggal tertentu.
  const slotTerpakai = ref<string[]>([]);

  // State utama form pemesanan.
  const form = ref(createPelangganPemesananFormState());
  // State pesan error validasi.
  const errors = ref(createPelangganPemesananErrors());
  // State penanda field sudah disentuh.
  const touched = ref(createPelangganPemesananTouched());

  // Data turunan: layanan yang dipilih berdasarkan id_layanan di form.
  const layananTerpilih = computed(() =>
    semuaLayanan.value.filter((layanan) =>
      form.value.id_layanan.includes(layanan.id),
    ),
  );

  // Data turunan: Vespa yang dipilih berdasarkan id_vespa di form.
  const vespaTerpilih = computed(() =>
    vespaSaya.value.find((vespa) => vespa.id === form.value.id_vespa),
  );

  // Data turunan: total harga dari semua layanan yang dipilih.
  const totalHarga = computed(() =>
    layananTerpilih.value.reduce((sum, layanan) => sum + layanan.harga, 0),
  );

  // Validasi satu field tertentu.
  const validasiBidang = (field: PemesananFormField) => {
    validatePelangganPemesananField(
      field,
      form.value,
      touched.value,
      errors.value,
      slotTerpakai.value,
    );
  };

  // Validasi beberapa field wajib sekaligus.
  const validasiBidangWajib = (fields: PemesananFormField[]) => {
    // Tandai semua field sebagai sudah disentuh lalu validasi.
    fields.forEach((field) => {
      touched.value[field] = true;
      validasiBidang(field);
    });

    // Return true jika semua field tidak punya error.
    return fields.every((field) => !errors.value[field]);
  };

  // Mengecek jam yang sudah terpakai untuk tanggal yang dipilih.
  const cekKetersediaan = async () => {
    // Jika tanggal belum dipilih, tidak perlu cek slot.
    if (!form.value.tanggal_pemesanan) return;

    // Ambil header token.
    const headers = getAuthHeaders();
    // Jika token tidak ada, hentikan proses.
    if (!Object.keys(headers).length) return;

    // Reset jam karena tanggal berubah.
    form.value.jam_pemesanan = "";
    try {
      // Panggil API cek slot berdasarkan tanggal.
      const { data } = await axios.get(
        `${API_URL}/pemesanan/cek-slot?date=${form.value.tanggal_pemesanan}`,
        { headers },
      );
      // Data dari Laravel mengembalikan jam dengan format "15:00:00" (HH:mm:ss)
      // Kita perlu mengambil "HH:mm" (5 karakter pertama) agar cocok dengan TIME_SLOTS
      const slots = data.data ?? data;
      // Ubah format jam dari HH:mm:ss menjadi HH:mm.
      slotTerpakai.value = (slots as string[]).map((time) =>
        time.substring(0, 5),
      );
    } catch (error: any) {
      // Catat dan tampilkan error cek slot.
      logError(error, "cekKetersediaan");
      toast.error(handleApiError(error));
    }
  };

  // Handler saat pilihan layanan berubah.
  const tanganiPerubahanLayanan = (layananIds: number[]) => {
    form.value.id_layanan = layananIds;
    touched.value.id_layanan = true;
    validasiBidang("id_layanan");
  };

  // Handler saat pilihan Vespa berubah.
  const tanganiPerubahanVespa = (vespaId: number | null) => {
    form.value.id_vespa = vespaId;
    touched.value.id_vespa = true;
    validasiBidang("id_vespa");
  };

  // Handler saat tanggal pemesanan berubah.
  const tanganiPerubahanTanggal = async () => {
    // Cek ulang slot jam pada tanggal baru.
    await cekKetersediaan();
    touched.value.tanggal_pemesanan = true;
    validasiBidang("tanggal_pemesanan");
  };

  // Handler saat pelanggan memilih jam.
  const tanganiPilihWaktu = () => {
    touched.value.jam_pemesanan = true;
    validasiBidang("jam_pemesanan");
  };

  // Mengirim data pemesanan ke backend.
  const kirimData = async () => {
    // Cegah submit ganda saat request masih berjalan.
    if (sedangMengirim.value) return;

    // Field wajib yang harus valid sebelum submit.
    const fieldsToValidate: PemesananFormField[] = [
      "id_vespa",
      "id_layanan",
      "tanggal_pemesanan",
      "jam_pemesanan",
    ];

    // Jika ada error validasi, tampilkan pesan dan hentikan submit.
    if (
      !validasiBidangWajib(fieldsToValidate) ||
      hasPelangganPemesananErrors(errors.value)
    ) {
      toast.error("Lengkapi semua field yang wajib");
      return;
    }

    // Tandai sedang mengirim data.
    sedangMengirim.value = true;

    try {
      // Ambil header token.
      const headers = getAuthHeaders();
      // Jika token tidak ada, hentikan proses.
      if (!Object.keys(headers).length) {
        return;
      }

      // Bentuk payload yang sesuai kebutuhan backend.
      const payload = buildPelangganPemesananPayload(form.value);

      // Kirim pemesanan baru ke backend.
      await axios.post(`${API_URL}/pemesanan`, payload, { headers });

      // Tampilkan pesan sukses.
      toast.success("Pemesanan berhasil! Silakan datang sesuai jadwal");
      // Setelah jeda singkat, pindah ke halaman riwayat.
      setTimeout(() => {
        router.push("/app/riwayat");
      }, 1500);
    } catch (error: any) {
      const payload = buildPelangganPemesananPayload(form.value);

      if (error.code === "ECONNABORTED") {
        try {
          const headers = getAuthHeaders();
          const { data } = await axios.get(`${API_URL}/pemesanan`, {
            headers,
            timeout: 10000,
          });

          const daftarPemesanan = data.data ?? data;
          const pemesananTersimpan = Array.isArray(daftarPemesanan)
            ? daftarPemesanan.some((pemesanan: any) => {
                const jamPemesanan = String(
                  pemesanan.jam_pemesanan || pemesanan.waktu_pemesanan || "",
                ).substring(0, 5);

                return (
                  Number(pemesanan.id_vespa) === payload.id_vespa &&
                  pemesanan.tanggal_pemesanan === payload.tanggal_pemesanan &&
                  jamPemesanan === payload.jam_pemesanan
                );
              })
            : false;

          if (pemesananTersimpan) {
            toast.success("Pemesanan berhasil dibuat. Email konfirmasi diproses terpisah.");
            setTimeout(() => {
              router.push("/app/riwayat");
            }, 1200);
            return;
          }
        } catch (cekError: any) {
          logError(cekError, "kirimData:cekPemesananSetelahTimeout");
        }
      }

      // Catat dan tampilkan error submit.
      logError(error, "kirimData");
      toast.error(handleApiError(error));
    } finally {
      // Matikan status mengirim.
      sedangMengirim.value = false;
    }
  };

  // Memuat data awal: daftar Vespa dan daftar layanan.
  const muatDataAwal = async () => {
    // Ambil header token.
    const headers = getAuthHeaders();
    // Jika token tidak ada, matikan loading dan hentikan proses.
    if (!Object.keys(headers).length) {
      sedangMemuat.value = false;
      return;
    }

    try {
      // Ambil data Vespa dan layanan secara bersamaan.
      const [vespas, layanan] = await Promise.all([
        axios.get(`${API_URL}/vespa-saya`, { headers }),
        axios.get(`${API_URL}/layanan`),
      ]);

      // Simpan data Vespa dari API.
      vespaSaya.value = vespas.data.data ?? vespas.data;
      // Simpan data layanan dari API.
      semuaLayanan.value = layanan.data.data ?? layanan.data;
    } catch (error: any) {
      // Catat dan tampilkan error.
      logError(error, "muatDataAwal");
      toast.error(handleApiError(error));
    } finally {
      // Matikan loading data awal.
      sedangMemuat.value = false;
    }
  };

  // Kembalikan state dan fungsi ke file .vue.
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
    validateRequiredFields: validasiBidangWajib,
    submit: kirimData,
    loadInitialData: muatDataAwal,
  };
}
