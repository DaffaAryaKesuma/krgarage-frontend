<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import {
  getChipBadgeClass,
  getToneTextClass,
} from "@/utils/badgeVariants";
import { getIconButtonClass } from "@/utils/buttonVariants";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useNotificationBell } from "./useNotificationBell";

const {
  isOpen,
  notifications,
  unreadCount,
  isLoading,
  hasUnread,
  toggleDropdown,
  getNotificationIcon,
  getNotificationColor,
  handleNotificationClick,
} = useNotificationBell();
</script>

<template>
  <div class="notification-bell-container relative">
    <button
      @click="toggleDropdown"
      :class="getIconButtonClass('neutral', 'md', 'relative')"
      title="Notifikasi"
    >
      <i
        class="mdi mdi-bell text-2xl"
        :class="hasUnread ? getToneTextClass('primary') : 'text-gray-700'"
      ></i>

      <span
        v-if="hasUnread"
        class="absolute -right-1 -top-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-white shadow-lg animate-pulse"
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
        class="absolute -right-6 sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
      >
        <div
          class="flex items-center justify-between rounded-t-xl border-b border-red-700 bg-red-600 px-4 py-3"
        >
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="mdi mdi-bell"></i>
            Notifikasi
          </h3>
        </div>

        <div v-if="isLoading" class="px-4 py-2">
          <LoadingSpinner message="Memuat notifikasi..." />
        </div>

        <div
          v-else-if="notifications.length > 0"
          class="max-h-96 overflow-y-auto custom-scrollbar"
        >
          <button
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 last:border-b-0"
            :class="{ 'bg-blue-50': !notification.sudah_dibaca }"
          >
            <div class="flex items-start gap-3">
              <div
                :class="[
                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
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

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <p
                      class="line-clamp-1 text-sm font-semibold text-gray-900 capitalize"
                      :class="{ 'font-bold': !notification.sudah_dibaca }"
                    >
                      {{ notification.judul }}
                    </p>
                    <span
                      v-if="notification.pemesanan?.kode_pemesanan"
                      :class="[getChipBadgeClass('primary'), 'mt-1 inline-block rounded px-2 py-0.5 font-mono text-xs font-bold']"
                    >
                      {{ notification.pemesanan.kode_pemesanan }}
                    </span>
                  </div>
                  <span
                    v-if="!notification.sudah_dibaca"
                    class="h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-blue-600"
                  ></span>
                </div>

                <p class="mt-1.5 text-xs text-gray-600">
                  {{ notification.pesan }}
                </p>

                <div class="mt-2 flex items-center gap-1 text-xs text-gray-500">
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
            Anda akan menerima notifikasi untuk pemesanan Anda di sini
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
