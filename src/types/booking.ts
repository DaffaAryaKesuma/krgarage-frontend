import type { SparepartSummary } from "./inventory";
import type { ServiceSummary } from "./service";
import type { MechanicProfile, UserProfile } from "./user";

export interface BookingVespa {
  model: string;
  plat_nomor: string;
  tahun_produksi?: number;
}

export interface BookingItem {
  id: number;
  suku_cadang: Pick<SparepartSummary, "id" | "nama_suku_cadang" | "kategori">;
  jumlah: number;
  harga_saat_ini: number;
}

export interface Booking {
  id: number;
  kode_pemesanan: string;
  created_at?: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  total_harga: number | null;
  id_mekanik: number | null;
  catatan_pelanggan?: string;
  pengguna: UserProfile;
  vespa: BookingVespa;
  layanan: Array<Pick<ServiceSummary, "id" | "nama_layanan" | "harga">>;
  mekanik?: MechanicProfile | null;
  item_pemesanan?: BookingItem[];
}

export interface MechanicOption {
  value: number;
  label: string;
}
