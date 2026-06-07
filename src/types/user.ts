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
}
