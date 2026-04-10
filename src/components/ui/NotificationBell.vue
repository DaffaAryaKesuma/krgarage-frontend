<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { getAuthHeaders } from "@/utils/auth";
import { logError } from "@/utils/errorHandler";
import { formatDateShort } from "@/utils/date";
import { API_URL } from "@/utils/api";

interface Notification {
  id: number;
  tipe: string;
  judul: string;
  pesan: string;
  sudah_dibaca: boolean;
  id_pemesanan: number | null;
  created_at: string;
  pemesanan?: {
    kode_pemesanan: string;
  };
}

const router = useRouter();
const route = useRoute();
const isOpen = ref(false);
const notifications = ref<Notification[]>([]);
const unreadCount = ref(0);
const isLoading = ref(false);

let pollingInterval: ReturnType<typeof setInterval> | null = null;

const hasUnread = computed(() => unreadCount.value > 0);

const fetchNotifications = async (background = false) => {
  try {
    if (!background) isLoading.value = true;

    const response = await axios.get(`${API_URL}/notifications`, {
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
      `${API_URL}/notifications/${notificationId}/mark-read`,
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
      `${API_URL}/notifications/mark-all-read`,
      {},
      { headers: getAuthHeaders() },
    );
    notifications.value.forEach((n) => (n.sudah_dibaca = true));
    unreadCount.value = 0;
  } catch (error: any) {
    logError(error, "NotificationBell.markAllAsRead");
  }
};

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.sudah_dibaca) {
    await markAsRead(notification.id);
  }

  if (notification.id_pemesanan) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "customer";

    if (role === "admin") {
      router.push(`/admin/pemesanan/${notification.id_pemesanan}`);
    } else if (role === "mechanic" || role === "mekanik") {
      router.push(`/mechanic/dasbor`);
    } else {
      router.push(`/app/riwayat`);
    }
  }

  isOpen.value = false;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    fetchNotifications(false);
  }
};

const getNotificationIcon = (tipe: string) => {
  const icons: Record<string, string> = {
    booking_confirmed: "mdi-check-circle",
    booking_in_progress: "mdi-progress-clock",
    booking_completed: "mdi-check-all",
    booking_cancelled: "mdi-close-circle",
    booking_assigned: "mdi-account-check",
    low_stock: "mdi-alert",
  };
  return icons[tipe] || "mdi-bell";
};

const getNotificationColor = (tipe: string) => {
  const colors: Record<string, string> = {
    booking_confirmed: "text-green-600 bg-green-50",
    booking_in_progress: "text-blue-600 bg-blue-50",
    booking_completed: "text-purple-600 bg-purple-50",
    booking_cancelled: "text-red-600 bg-red-50",
    booking_assigned: "text-orange-600 bg-orange-50",
    low_stock: "text-yellow-600 bg-yellow-50",
  };
  return colors[tipe] || "text-gray-600 bg-gray-50";
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
</script>

<template>
  <div class="notification-bell-container relative">
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      :class="{ 'bg-red-50': isOpen || hasUnread }"
      title="Notifikasi"
    >
      <i
        class="mdi mdi-bell text-2xl"
        :class="hasUnread ? 'text-red-600' : 'text-gray-700'"
      ></i>

      <span
        v-if="hasUnread"
        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full min-w-[20px] animate-pulse shadow-lg"
      >
        {{ unreadCount > 99 ? "99+" : unreadCount }}
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
      >
        <div
          class="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl"
        >
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="mdi mdi-bell"></i>
            Notifikasi
          </h3>
          <button
            v-if="hasUnread"
            @click="markAllAsRead"
            class="text-xs text-white hover:text-red-100 font-medium underline"
          >
            Tandai Semua Dibaca
          </button>
        </div>

        <div v-if="isLoading" class="p-6 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"
          ></div>
          <p class="mt-2 text-sm text-gray-600">Memuat notifikasi...</p>
        </div>

        <div
          v-else-if="notifications.length > 0"
          class="max-h-96 overflow-y-auto"
        >
          <button
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="w-full px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
            :class="{ 'bg-blue-50': !notification.sudah_dibaca }"
          >
            <div class="flex items-start gap-3">
              <div
                :class="[
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  getNotificationColor(notification.tipe),
                ]"
              >
                <i
                  :class="[
                    'mdi',
                    'text-xl',
                    getNotificationIcon(notification.tipe),
                  ]"
                ></i>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <p
                      class="text-sm font-semibold text-gray-900 line-clamp-1"
                      :class="{ 'font-bold': !notification.sudah_dibaca }"
                    >
                      {{ notification.judul }}
                    </p>
                    <span
                      v-if="notification.pemesanan?.kode_pemesanan"
                      class="inline-block mt-1 text-xs font-mono font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded"
                    >
                      {{ notification.pemesanan.kode_pemesanan }}
                    </span>
                  </div>
                  <span
                    v-if="!notification.sudah_dibaca"
                    class="flex-shrink-0 w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"
                  ></span>
                </div>

                <p class="text-xs text-gray-600 mt-1.5 line-clamp-2">
                  {{ notification.pesan }}
                </p>

                <div class="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <i class="mdi mdi-clock-outline"></i>
                  <span>{{ formatDateShort(notification.created_at) }}</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div v-else class="p-8 text-center">
          <i class="mdi mdi-bell-off text-5xl text-gray-300 mb-3"></i>
          <p class="text-gray-600 font-medium">Tidak ada notifikasi</p>
          <p class="text-sm text-gray-500 mt-1">
            Anda akan menerima notifikasi untuk booking Anda di sini
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
