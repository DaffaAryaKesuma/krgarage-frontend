import { computed, onMounted, onUnmounted, ref, watch } from "vue";
// Axios untuk mengambil dan mengubah status baca notifikasi.
import axios from "axios";
import {
  NavigationFailureType,
  isNavigationFailure,
  useRoute,
  useRouter,
} from "vue-router";
// Auth helper untuk header token dan role user login.
import { getAuthHeaders, getCurrentUser } from "@/utils/auth";
import { logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
// Refresh notifikasi saat data global berubah.
import { useRealtimeRefresh } from "@/composables/useRealtimeRefresh";
// Fallback route berdasarkan role.
import { getRedirectPathForRole } from "@/utils/roleRoutes";
import {
  getPemesananIdFromNotification,
  getNotificationColor,
  getNotificationIcon,
  normalizeRole,
  resolveNotificationTarget,
  type AppNotification,
} from "@/components/ui/NotificationBell/notificationBellHelpers";

export type { AppNotification };

// Composable utama notification bell.
export function useNotificationBell() {
  // Router untuk pindah halaman saat notifikasi diklik.
  const router = useRouter();
  // Route dipantau agar notifikasi bisa refresh saat pindah halaman.
  const route = useRoute();

  // Buka/tutup dropdown.
  const isOpen = ref(false);
  // Daftar notifikasi dari API.
  const notifications = ref<AppNotification[]>([]);
  // Jumlah notifikasi belum dibaca.
  const unreadCount = ref(0);
  // Loading dropdown.
  const isLoading = ref(false);

  // true jika ada notifikasi belum dibaca.
  const hasUnread = computed(() => unreadCount.value > 0);

  // Mengambil notifikasi dari backend.
  const fetchNotifications = async (background = false) => {
    try {
      // background true berarti refresh diam-diam tanpa spinner.
      if (!background) isLoading.value = true;

      const response = await axios.get(`${API_URL}/notifikasi`, {
        headers: getAuthHeaders(),
      });
      // Backend mengirim list dan jumlah belum dibaca.
      notifications.value = response.data.notifikasi || [];
      unreadCount.value = response.data.jumlah_belum_dibaca || 0;
    } catch (error: any) {
      if (!background) logError(error, "NotificationBell.fetchNotifications");
    } finally {
      if (!background) isLoading.value = false;
    }
  };

  // Menandai satu notifikasi sebagai sudah dibaca.
  const markAsRead = async (idNotifikasi: number) => {
    try {
      await axios.post(
        `${API_URL}/notifikasi/${idNotifikasi}/tandai-dibaca`,
        {},
        { headers: getAuthHeaders() },
      );

      // Update state lokal agar badge langsung berubah tanpa fetch ulang.
      const itemNotifikasi = notifications.value.find(
        (notifikasi) => notifikasi.id === idNotifikasi,
      );
      if (itemNotifikasi && !itemNotifikasi.sudah_dibaca) {
        itemNotifikasi.sudah_dibaca = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (error: any) {
      logError(error, "NotificationBell.markAsRead");
    }
  };

  // Menandai semua notifikasi sebagai sudah dibaca.
  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${API_URL}/notifikasi/tandai-semua-dibaca`,
        {},
        { headers: getAuthHeaders() },
      );
      // Update lokal semua item menjadi terbaca.
      notifications.value.forEach((notifikasi) => (notifikasi.sudah_dibaca = true));
      unreadCount.value = 0;
    } catch (error: any) {
      logError(error, "NotificationBell.markAllAsRead");
    }
  };

  // Saat satu notifikasi diklik, tandai baca lalu arahkan ke halaman terkait.
  const handleNotificationClick = async (itemNotifikasi: AppNotification) => {
    // Jika belum dibaca, update ke backend dulu.
    if (!itemNotifikasi.sudah_dibaca) {
      await markAsRead(itemNotifikasi.id);
    }

    // Tutup dropdown sebelum navigasi.
    isOpen.value = false;

    // Tentukan target route berdasarkan role user dan tipe notifikasi.
    const target = resolveNotificationTarget(
      normalizeRole(getCurrentUser()?.role),
      getPemesananIdFromNotification(itemNotifikasi),
      itemNotifikasi.tipe,
    );

    try {
      await router.push(target);
    } catch (error: any) {
      // Navigation duplicated bukan error serius.
      if (!isNavigationFailure(error, NavigationFailureType.duplicated)) {
        logError(error, "NotificationBell.handleNotificationClick");

        // Jika target gagal, fallback ke dasbor sesuai role.
        const fallbackRole = normalizeRole(getCurrentUser()?.role);
        await router.push(getRedirectPathForRole(fallbackRole));
      }
    }
  };

  // Membuka/tutup dropdown bell.
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      fetchNotifications(false);
      // Auto mark all as read saat bell diklik.
      if (hasUnread.value) {
        markAllAsRead();
      }
    }
  };

  // Menutup dropdown saat user klik di luar area bell.
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".notification-bell-container")) {
      isOpen.value = false;
    }
  };

  // Refresh notifikasi saat pindah route.
  watch(
    () => route.path,
    () => {
      fetchNotifications(true);
    },
  );

  // Refresh notifikasi saat ada event realtime.
  useRealtimeRefresh(() => fetchNotifications(true), {
    events: ["notifikasi.changed", "pemesanan.changed"],
  });

  // Pasang listener dan ambil notifikasi pertama kali.
  onMounted(() => {
    document.addEventListener("click", handleClickOutside);

    fetchNotifications(false);
  });

  // Lepas listener saat bell unmount.
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  // State dan helper yang dipakai NotificationBell.vue.
  return {
    isOpen,
    notifications,
    unreadCount,
    isLoading,
    hasUnread,
    toggleDropdown,
    markAllAsRead,
    getNotificationIcon,
    getNotificationColor,
    handleNotificationClick,
  };
}
