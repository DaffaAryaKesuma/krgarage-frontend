import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import axios from "axios";
import {
  NavigationFailureType,
  isNavigationFailure,
  useRoute,
  useRouter,
} from "vue-router";
import { getAuthHeaders, getCurrentUser } from "@/utils/auth";
import { logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getRedirectPathForRole } from "@/utils/roleRoutes";
import {
  getBookingIdFromNotification,
  getNotificationColor,
  getNotificationIcon,
  normalizeRole,
  resolveNotificationTarget,
  type AppNotification,
} from "@/composables/helpers/notificationBellHelpers";

export type { AppNotification };

export function useNotificationBell() {
  const router = useRouter();
  const route = useRoute();

  const isOpen = ref(false);
  const notifications = ref<AppNotification[]>([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);

  let pollingInterval: ReturnType<typeof setInterval> | null = null;

  const hasUnread = computed(() => unreadCount.value > 0);

  const fetchNotifications = async (background = false) => {
    try {
      if (!background) isLoading.value = true;

      const response = await axios.get(`${API_URL}/notifikasi`, {
        headers: getAuthHeaders(),
      });
      notifications.value = response.data.notifikasi || [];
      unreadCount.value = response.data.jumlah_belum_dibaca || 0;
    } catch (error: any) {
      if (!background) logError(error, "NotificationBell.fetchNotifications");
    } finally {
      if (!background) isLoading.value = false;
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await axios.post(
        `${API_URL}/notifikasi/${notificationId}/tandai-dibaca`,
        {},
        { headers: getAuthHeaders() },
      );

      const notification = notifications.value.find(
        (n) => n.id === notificationId,
      );
      if (notification && !notification.sudah_dibaca) {
        notification.sudah_dibaca = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (error: any) {
      logError(error, "NotificationBell.markAsRead");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${API_URL}/notifikasi/tandai-semua-dibaca`,
        {},
        { headers: getAuthHeaders() },
      );
      notifications.value.forEach((n) => (n.sudah_dibaca = true));
      unreadCount.value = 0;
    } catch (error: any) {
      logError(error, "NotificationBell.markAllAsRead");
    }
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.sudah_dibaca) {
      await markAsRead(notification.id);
    }

    isOpen.value = false;

    const target = resolveNotificationTarget(
      normalizeRole(getCurrentUser()?.role),
      getBookingIdFromNotification(notification),
      notification.tipe,
    );

    try {
      await router.push(target);
    } catch (error: any) {
      if (!isNavigationFailure(error, NavigationFailureType.duplicated)) {
        logError(error, "NotificationBell.handleNotificationClick");

        const fallbackRole = normalizeRole(getCurrentUser()?.role);
        await router.push(getRedirectPathForRole(fallbackRole));
      }
    }
  };

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      fetchNotifications(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".notification-bell-container")) {
      isOpen.value = false;
    }
  };

  watch(
    () => route.path,
    () => {
      fetchNotifications(true);
    },
  );

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);

    fetchNotifications(false);

    pollingInterval = setInterval(() => {
      fetchNotifications(true);
    }, 10000);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);

    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  });

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
