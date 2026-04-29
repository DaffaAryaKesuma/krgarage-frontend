import type { SparepartSummary } from "./inventory";
import type { MekanikProfile, UserProfile } from "./user";

export interface BookingVespa {
  model: string;
  plat_nomor: string;
  tahun_produksi?: number;
}

export interface BookingItem {
  id: number;
  suku_cadang: Pick<SparepartSummary, "nama_suku_cadang" | "kategori"> & {
    id?: number;
  };
  jumlah: number;
  harga_saat_ini: number;
}

export interface BookingServiceLine {
  id?: number;
  nama_layanan: string;
  harga?: number;
  pivot?: {
    harga_saat_pesan?: number;
  };
}

export interface Booking {
  id: number;
  kode_pemesanan: string;
  created_at?: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  status_pembayaran?: string | null;
  total_harga: number | null;
  id_mekanik: number | null;
  catatan_pelanggan?: string;
  catatan_mekanik?: string;
  pengguna: UserProfile;
  vespa: BookingVespa;
  layanan: BookingServiceLine[];
  mekanik?: MekanikProfile | null;
  item_pemesanan?: BookingItem[];
}

export interface MekanikOption {
  value: number;
  label: string;
}

export interface PelangganBooking {
  id: number;
  kode_pemesanan: string;
  created_at?: string;
  tanggal_pemesanan: string;
  jam_pemesanan?: string;
  status: string;
  status_pembayaran?: string | null;
  total_harga?: number | null;
  catatan_mekanik?: string;
  vespa: Pick<BookingVespa, "model" | "plat_nomor">;
  layanan: BookingServiceLine[];
  item_pemesanan?: BookingItem[];
}

export interface MekanikBookingService {
  id: number;
  nama_layanan: string;
}

export interface MekanikBooking {
  id: number;
  kode_pemesanan: string;
  pengguna: UserProfile;
  vespa: BookingVespa;
  layanan?: MekanikBookingService[];
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  status_pembayaran?: string | null;
  catatan_pelanggan?: string;
  catatan_mekanik?: string;
  item_pemesanan?: BookingItem[];
}

export interface FinancialBookingService {
  nama_layanan: string;
  pivot: {
    harga_saat_pesan: number;
  };
}

export interface FinancialBooking {
  id: number;
  kode_pemesanan: string;
  updated_at?: string;
  tanggal_pemesanan?: string;
  total_harga: number | null;
  status?: string;
  status_pembayaran?: string | null;
  pengguna: Pick<UserProfile, "nama">;
  vespa?: Pick<BookingVespa, "plat_nomor">;
  layanan: FinancialBookingService[];
  item_pemesanan?: Array<{
    jumlah: number;
    suku_cadang: {
      nama_suku_cadang: string;
    };
  }>;
}

export interface PemilikRecentBookingActivity {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  nama_pelanggan: string;
  nama_layanan: string;
  total_harga: number;
  status: string;
  status_pembayaran?: string | null;
}
