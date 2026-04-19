import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_URL } from "@/utils/api";
import { getCurrentUser, clearAuth, getAuthHeaders } from "@/utils/auth";

type DesktopBreakpoint = "md" | "lg" | "xl";

interface LayoutUser {
  nama: string;
  email: string;
}

export function useAuthenticatedLayoutShell(
  desktopBreakpoint: DesktopBreakpoint,
) {
  const router = useRouter();

  const isMobileMenuOpen = ref(false);
  const showLogoutConfirm = ref(false);
  const user = ref<LayoutUser>({ nama: "Guest", email: "" });

  const userInitials = computed(() => {
    const names = user.value.nama.trim().split(" ").filter(Boolean);
    return names.length >= 2
      ? (names[0][0] + names[1][0]).toUpperCase()
      : user.value.nama.charAt(0).toUpperCase();
  });

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

  const handleLogout = async () => {
    try {
      const headers = getAuthHeaders();
      if (Object.keys(headers).length) {
        await axios.post(`${API_URL}/keluar`, {}, { headers });
      }
    } catch {
      // Local auth cleanup tetap dijalankan meskipun request logout gagal.
    } finally {
      clearAuth();
      showLogoutConfirm.value = false;
      router.push("/");
    }
  };

  const closeMenu = () => {
    isMobileMenuOpen.value = false;
  };

  onMounted(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      user.value = storedUser;
    }
  });

  return {
    isMobileMenuOpen,
    showLogoutConfirm,
    user,
    userInitials,
    breakpointClasses,
    handleLogout,
    closeMenu,
  };
}
