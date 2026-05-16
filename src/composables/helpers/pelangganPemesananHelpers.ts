import dayjs from "dayjs";

export type PemesananFormField =
  | "id_vespa"
  | "layanan_ids"
  | "tanggal_pemesanan"
  | "jam_pemesanan";

export interface PelangganPemesananFormState {
  id_vespa: number | null;
  layanan_ids: number[];
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  catatan_pelanggan: string;
}

export interface PelangganPemesananErrors {
  id_vespa: string;
  layanan_ids: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
}

export interface PelangganPemesananTouched {
  id_vespa: boolean;
  layanan_ids: boolean;
  tanggal_pemesanan: boolean;
  jam_pemesanan: boolean;
}

export function createPelangganPemesananFormState(): PelangganPemesananFormState {
  return {
    id_vespa: null,
    layanan_ids: [],
    tanggal_pemesanan: "",
    jam_pemesanan: "",
    catatan_pelanggan: "",
  };
}

export function createPelangganPemesananErrors(): PelangganPemesananErrors {
  return {
    id_vespa: "",
    layanan_ids: "",
    tanggal_pemesanan: "",
    jam_pemesanan: "",
  };
}

export function createPelangganPemesananTouched(): PelangganPemesananTouched {
  return {
    id_vespa: false,
    layanan_ids: false,
    tanggal_pemesanan: false,
    jam_pemesanan: false,
  };
}

export function validatePelangganPemesananField(
  field: PemesananFormField,
  form: PelangganPemesananFormState,
  touched: PelangganPemesananTouched,
  errors: PelangganPemesananErrors,
  bookedSlots: string[],
) {
  if (!touched[field]) return;

  if (field === "id_vespa") {
    errors.id_vespa = form.id_vespa ? "" : "Pilih vespa";
    return;
  }

  if (field === "layanan_ids") {
    errors.layanan_ids = form.layanan_ids.length
      ? ""
      : "Pilih minimal 1 layanan";
    return;
  }

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

  if (!form.jam_pemesanan || form.jam_pemesanan.trim() === "") {
    errors.jam_pemesanan = "Jam pemesanan harus dipilih";
    return;
  }

  errors.jam_pemesanan = bookedSlots.includes(form.jam_pemesanan)
    ? "Jam ini sudah dipesan"
    : "";
}

export function hasPelangganPemesananErrors(
  errors: PelangganPemesananErrors,
): boolean {
  return Object.values(errors).some((err) => err);
}

export function buildPelangganPemesananPayload(form: PelangganPemesananFormState) {
  return {
    id_vespa: Number(form.id_vespa),
    layanan_ids: form.layanan_ids.map((id) => Number(id)),
    tanggal_pemesanan: form.tanggal_pemesanan,
    jam_pemesanan: form.jam_pemesanan,
    catatan_pelanggan: form.catatan_pelanggan || null,
  };
}
