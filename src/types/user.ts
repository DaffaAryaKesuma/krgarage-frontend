// Profil user umum yang sering dikirim bersama pemesanan.
export interface UserProfile {
  nama: string;
  email?: string;
  no_telepon?: string;
}

// Profil mekanik yang ditampilkan pada pemesanan.
export interface MekanikProfile {
  id: number;
  nama: string;
  email?: string;
  tersedia?: boolean;
  sedang_bertugas?: boolean;
  tugas_aktif?: {
    id: number;
    kode_pemesanan: string;
    tanggal_pemesanan: string;
    jam_pemesanan: string;
    status: string;
  } | null;
}
