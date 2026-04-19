import dayjs from "dayjs";

export type BookingFormField =
  | "id_vespa"
  | "service_ids"
  | "tanggal_pemesanan"
  | "jam_pemesanan";

export interface PelangganBookingFormState {
  id_vespa: number | null;
  service_ids: number[];
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  catatan_pelanggan: string;
}

export interface PelangganBookingErrors {
  id_vespa: string;
  service_ids: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
}

export interface PelangganBookingTouched {
  id_vespa: boolean;
  service_ids: boolean;
  tanggal_pemesanan: boolean;
  jam_pemesanan: boolean;
}

export function createPelangganBookingFormState(): PelangganBookingFormState {
  return {
    id_vespa: null,
    service_ids: [],
    tanggal_pemesanan: "",
    jam_pemesanan: "",
    catatan_pelanggan: "",
  };
}

export function createPelangganBookingErrors(): PelangganBookingErrors {
  return {
    id_vespa: "",
    service_ids: "",
    tanggal_pemesanan: "",
    jam_pemesanan: "",
  };
}

export function createPelangganBookingTouched(): PelangganBookingTouched {
  return {
    id_vespa: false,
    service_ids: false,
    tanggal_pemesanan: false,
    jam_pemesanan: false,
  };
}

export function validatePelangganBookingField(
  field: BookingFormField,
  form: PelangganBookingFormState,
  touched: PelangganBookingTouched,
  errors: PelangganBookingErrors,
  bookedSlots: string[],
) {
  if (!touched[field]) return;

  if (field === "id_vespa") {
    errors.id_vespa = form.id_vespa ? "" : "Pilih vespa";
    return;
  }

  if (field === "service_ids") {
    errors.service_ids = form.service_ids.length
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

export function hasPelangganBookingErrors(
  errors: PelangganBookingErrors,
): boolean {
  return Object.values(errors).some((err) => err);
}

export function buildPelangganBookingPayload(form: PelangganBookingFormState) {
  return {
    id_vespa: Number(form.id_vespa),
    service_ids: form.service_ids.map((id) => Number(id)),
    tanggal_pemesanan: form.tanggal_pemesanan,
    jam_pemesanan: form.jam_pemesanan,
    catatan_pelanggan: form.catatan_pelanggan || null,
  };
}
