// Mengambil dayjs untuk validasi tanggal.
import dayjs from "dayjs";

// Daftar nama field yang ada di form pemesanan.
export type PemesananFormField =
  | "id_vespa"
  | "id_layanan"
  | "tanggal_pemesanan"
  | "jam_pemesanan";

// Bentuk data utama form pemesanan.
export interface PelangganPemesananFormState {
  id_vespa: number | null;
  id_layanan: number[];
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  catatan_pelanggan: string;
}

// Bentuk data error untuk setiap field form.
export interface PelangganPemesananErrors {
  id_vespa: string;
  id_layanan: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
}

// Bentuk data penanda apakah field sudah disentuh user.
export interface PelangganPemesananTouched {
  id_vespa: boolean;
  id_layanan: boolean;
  tanggal_pemesanan: boolean;
  jam_pemesanan: boolean;
}

// Membuat state awal form pemesanan.
export function createPelangganPemesananFormState(): PelangganPemesananFormState {
  return {
    id_vespa: null,
    id_layanan: [],
    tanggal_pemesanan: "",
    jam_pemesanan: "",
    catatan_pelanggan: "",
  };
}

// Membuat state awal error form.
export function createPelangganPemesananErrors(): PelangganPemesananErrors {
  return {
    id_vespa: "",
    id_layanan: "",
    tanggal_pemesanan: "",
    jam_pemesanan: "",
  };
}

// Membuat state awal touched form.
export function createPelangganPemesananTouched(): PelangganPemesananTouched {
  return {
    id_vespa: false,
    id_layanan: false,
    tanggal_pemesanan: false,
    jam_pemesanan: false,
  };
}

// Memvalidasi satu field form pemesanan.
export function validatePelangganPemesananField(
  field: PemesananFormField,
  form: PelangganPemesananFormState,
  touched: PelangganPemesananTouched,
  errors: PelangganPemesananErrors,
  bookedSlots: string[],
) {
  // Jika field belum disentuh, jangan tampilkan error dulu.
  if (!touched[field]) return;

  // Validasi Vespa wajib dipilih.
  if (field === "id_vespa") {
    errors.id_vespa = form.id_vespa ? "" : "Pilih vespa";
    return;
  }

  // Validasi minimal satu layanan dipilih.
  if (field === "id_layanan") {
    errors.id_layanan = form.id_layanan.length
      ? ""
      : "Pilih minimal 1 layanan";
    return;
  }

  // Validasi tanggal wajib diisi dan tidak boleh masa lalu.
  if (field === "tanggal_pemesanan") {
    if (!form.tanggal_pemesanan) {
      errors.tanggal_pemesanan = "Tanggal pemesanan harus diisi";
      return;
    }

    const selectedDate = dayjs(form.tanggal_pemesanan);
    const today = dayjs().startOf("day");
    errors.tanggal_pemesanan = selectedDate.isBefore(today)
      ? "Tanggal tidak boleh di masa lalu"
      : "";
    return;
  }

  // Validasi jam wajib dipilih.
  if (!form.jam_pemesanan || form.jam_pemesanan.trim() === "") {
    errors.jam_pemesanan = "Jam pemesanan harus dipilih";
    return;
  }

  // Validasi jam tidak boleh termasuk slot yang sudah dipesan.
  errors.jam_pemesanan = bookedSlots.includes(form.jam_pemesanan)
    ? "Jam ini sudah dipesan"
    : "";
}

// Mengecek apakah masih ada error di form.
export function hasPelangganPemesananErrors(
  errors: PelangganPemesananErrors,
): boolean {
  return Object.values(errors).some((err) => err);
}

// Membentuk payload yang akan dikirim ke backend saat submit pemesanan.
export function buildPelangganPemesananPayload(form: PelangganPemesananFormState) {
  return {
    id_vespa: Number(form.id_vespa),
    id_layanan: form.id_layanan.map((id) => Number(id)),
    tanggal_pemesanan: form.tanggal_pemesanan,
    jam_pemesanan: form.jam_pemesanan,
    catatan_pelanggan: form.catatan_pelanggan || null,
  };
}
