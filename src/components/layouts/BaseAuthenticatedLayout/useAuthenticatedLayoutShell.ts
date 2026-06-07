// computed untuk nilai turunan, onMounted untuk inisialisasi user, ref untuk state UI.
import { computed, onMounted, ref } from "vue";
// Axios dipakai saat logout ke backend.
import axios from "axios";
// Router dan route dipakai untuk redirect dan cek menu aktif.
import { useRouter, useRoute } from "vue-router";
// API_URL adalah base endpoint backend.
import { API_URL } from "@/utils/api";
// Helper auth membaca user/token dan membersihkan session.
import { getCurrentUser, clearAuth, getAuthHeaders } from "@/utils/auth";

// Breakpoint desktop menentukan kapan menu desktop muncul.
type DesktopBreakpoint = "md" | "lg" | "xl";

// Data user minimal yang dibutuhkan layout.
interface LayoutUser {
  nama: string;
  email: string;
}

// Mengubah data user mentah dari localStorage menjadi bentuk aman untuk layout.
function normalizeLayoutUser(rawUser: unknown): LayoutUser {
  if (!rawUser || typeof rawUser !== "object") {
    return { nama: "Guest", email: "" };
  }

  // rawUser berasal dari localStorage, jadi dicek manual field-nya.
  const source = rawUser as Record<string, unknown>;
  const namaCandidate =
    typeof source.nama === "string"
      ? source.nama
      : typeof source.name === "string"
        ? source.name
        : "";

  const emailCandidate = typeof source.email === "string" ? source.email : "";

  // Jika nama kosong, tampilkan Guest sebagai fallback.
  const nama = namaCandidate.trim() || "Guest";

  return {
    nama,
    email: emailCandidate,
  };
}

// Composable ini memegang state dan aksi umum untuk semua layout role.
export function useAuthenticatedLayoutShell(
  desktopBreakpoint: DesktopBreakpoint,
) {
  // Router untuk redirect, route untuk cek path aktif.
  const router = useRouter();
  const route = useRoute();

  // State buka/tutup menu mobile.
  const isMobileMenuOpen = ref(false);
  // State modal konfirmasi logout.
  const showLogoutConfirm = ref(false);
  // State modal profil.
  const showProfilModal = ref(false);
  // Data user yang ditampilkan di navbar.
  const user = ref<LayoutUser>(normalizeLayoutUser(null));

  // Inisial user untuk avatar bulat.
  const userInitials = computed(() => {
    const safeName = (user.value.nama || "Guest").trim();
    const names = safeName.split(" ").filter(Boolean);

    if (!names.length) {
      // Fallback jika nama kosong.
      return "G";
    }

    return names.length >= 2
      ? (names[0][0] + names[1][0]).toUpperCase()
      : names[0].charAt(0).toUpperCase();
  });

  // Class breakpoint disesuaikan dengan props layout tiap role.
  const breakpointClasses = computed(() => {
    if (desktopBreakpoint === "xl") {
      return {
        desktopMenu: "hidden xl:flex",
        mobileMenuButton: "xl:hidden",
        mobileMenu: "xl:hidden",
      };
    }

    if (desktopBreakpoint === "lg") {
      return {
        desktopMenu: "hidden lg:flex",
        mobileMenuButton: "lg:hidden",
        mobileMenu: "lg:hidden",
      };
    }

    return {
      desktopMenu: "hidden md:flex",
      mobileMenuButton: "md:hidden",
      mobileMenu: "md:hidden",
    };
  });

  // Logout memanggil backend lalu membersihkan auth lokal.
  const handleLogout = async () => {
    try {
      const headers = getAuthHeaders();
      if (Object.keys(headers).length) {
        // Kirim request logout hanya jika masih ada header auth.
        await axios.post(`${API_URL}/keluar`, {}, { headers });
      }
    } catch {
      // Local auth cleanup tetap dijalankan meskipun request logout gagal.
    } finally {
      // Bersihkan localStorage dan arahkan ke beranda.
      clearAuth();
      showLogoutConfirm.value = false;
      router.push("/");
    }
  };

  // Menutup drawer menu mobile.
  const closeMenu = () => {
    isMobileMenuOpen.value = false;
  };

  // Mengecek apakah menu cocok dengan route saat ini.
  const isActive = (path: string) =>
    path === "/"
      ? route.path === "/"
      : route.path === path || route.path.startsWith(path + "/");

  // Saat layout dimount, ambil user login dari localStorage.
  onMounted(() => {
    const storedUser = getCurrentUser();
    user.value = normalizeLayoutUser(storedUser);
  });

  // Semua state dan helper dikembalikan ke komponen layout.
  return {
    isMobileMenuOpen,
    showLogoutConfirm,
    showProfilModal,
    user,
    userInitials,
    breakpointClasses,
    handleLogout,
    closeMenu,
    isActive,
    route,
  };
}
