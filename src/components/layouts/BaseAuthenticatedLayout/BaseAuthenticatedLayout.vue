<script setup lang="ts">
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import NotificationBell from "@/components/ui/NotificationBell/NotificationBell.vue";
import ProfilModal from "@/components/ui/ProfilModal/ProfilModal.vue";
import { useAuthenticatedLayoutShell } from "./useAuthenticatedLayoutShell";
import { scrollLock } from "@/composables/scrollLock";
import { formatNama } from "@/utils/format";

interface NavItem {
  label: string;
  to: string;
  icon: string;
}

interface Props {
  berandaPath: string;
  roleLabel: string;
  navItems?: NavItem[];
  appTitle?: string;
  appSubtitle?: string;
  desktopBreakpoint?: "md" | "lg" | "xl";
  rootClass?: string;
  navClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  appTitle: "KRGarage",
  appSubtitle: "",
  desktopBreakpoint: "md",
  rootClass: "min-h-screen bg-gray-50",
  navClass: "bg-white shadow-md sticky top-0 z-50",
  navItems: () => [],
});

const {
  isMobileMenuOpen,
  showLogoutConfirm,
  showProfilModal,
  user,
  userInitials,
  breakpointClasses,
  handleLogout,
  closeMenu,
  isActive,
} = useAuthenticatedLayoutShell(props.desktopBreakpoint);

scrollLock(() => isMobileMenuOpen.value);
</script>

<template>
  <div :class="rootClass">
    <nav :class="navClass">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-2 lg:gap-4">
          <!-- Left: Logo Link -->
          <router-link
            :to="berandaPath"
            class="flex min-w-0 items-center gap-2 no-underline"
          >
            <img
              src="@/assets/logo.png"
              alt="KRGarage"
              class="h-10 w-10 shrink-0"
            />
            <div class="hidden sm:block leading-tight">
              <p class="text-lg font-bold text-gray-900 lg:text-xl">
                {{ appTitle }}
              </p>
              <p class="hidden text-xs text-gray-500 md:block">
                {{ appSubtitle }}
              </p>
            </div>
          </router-link>

          <!-- Desktop Menu & Profile Tools -->
          <div
            :class="[
              breakpointClasses.desktopMenu,
              'min-w-0 flex-1 items-center justify-end gap-1',
            ]"
          >
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :class="[
                'group inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-all duration-200 no-underline lg:px-3 xl:px-4',
                isActive(item.to)
                  ? 'bg-red-50 text-red-600 font-semibold shadow-sm shadow-red-100/50'
                  : 'text-gray-700 font-medium hover:text-red-600 hover:bg-gray-50'
              ]"
            >
              <i :class="['mdi shrink-0 text-base transition-colors duration-200', item.icon, isActive(item.to) ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600']"></i>
              <span>{{ item.label }}</span>
            </router-link>

            <div
              v-if="navItems.length"
              class="mx-1 hidden h-8 w-px bg-gray-300 xl:block"
            ></div>

            <div
              class="flex items-center gap-2 sm:gap-3"
              :class="{ 'ml-1 lg:ml-2': navItems.length }"
            >
              <NotificationBell />

              <div class="hidden text-right xl:block">
                <p class="text-sm font-semibold text-gray-900">
                  <span>{{ formatNama(user.nama) }}</span>
                </p>
                <p class="text-xs text-red-600 font-medium">{{ roleLabel }}</p>
              </div>

              <div
                class="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-4 hover:ring-red-100 transition-all shadow-md"
                @click="showProfilModal = true"
                title="Lihat Profil"
              >
                {{ userInitials }}
              </div>

              <button
                @click="showLogoutConfirm = true"
                class="shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100"
                title="Keluar"
              >
                <i class="mdi mdi-logout text-xl text-gray-700"></i>
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button (Hamburger) -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            :class="[
              breakpointClasses.mobileMenuButton,
              'shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100',
            ]"
          >
            <i
              :class="[
                'mdi text-2xl text-gray-700',
                isMobileMenuOpen ? 'mdi-close' : 'mdi-menu',
              ]"
            ></i>
          </button>
        </div>

      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity duration-300"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        :class="[breakpointClasses.mobileMenu, 'fixed inset-0 z-40 bg-black/60']"
        @click="closeMenu"
      ></div>
    </transition>

    <!-- Mobile Menu Drawer -->
    <transition
      enter-from-class="translate-x-full"
      enter-active-class="transition-transform duration-300 ease-out"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isMobileMenuOpen"
        :class="[
          breakpointClasses.mobileMenu,
          'fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm bg-white p-6 shadow-2xl flex flex-col border-l border-gray-100'
        ]"
      >
        <!-- Mobile Menu Header with Close Icon -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Menu</h2>
          <button
            @click="closeMenu"
            class="p-2 text-gray-500 hover:text-red-700 transition"
          >
            <i class="mdi mdi-close text-2xl"></i>
          </button>
        </div>

        <!-- User Profile Card -->
        <div
          class="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-6 border border-gray-100"
        >
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-sm"
            @click="
              showProfilModal = true;
              closeMenu();
            "
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">
              <span>{{ formatNama(user.nama) }}</span>
            </p>
            <p class="text-xs text-gray-500 font-medium truncate">{{ roleLabel }}</p>
          </div>
          <NotificationBell />
        </div>

        <!-- Navigation Items -->
        <nav class="flex flex-col gap-2 mb-6 flex-1 overflow-y-auto">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="closeMenu"
            :class="[
              'group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium no-underline w-full',
              isActive(item.to)
                ? 'bg-red-50 text-red-600 font-semibold shadow-sm shadow-red-100/30'
                : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
            ]"
          >
            <i
              :class="[
                'mdi text-xl transition-colors duration-200',
                item.icon,
                isActive(item.to) ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'
              ]"
            ></i>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Logout button at the bottom -->
        <div class="border-t pt-4">
          <button
            @click="
              showLogoutConfirm = true;
              closeMenu();
            "
            class="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
          >
            <i class="mdi mdi-logout text-lg"></i>
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </transition>

    <main class="content-safe">
      <router-view :key="route.fullPath" />
    </main>

    <ConfirmationModal
      :show="showLogoutConfirm"
      title="Konfirmasi Keluar"
      message="Apakah Anda yakin ingin keluar dari sistem?"
      confirm-text="Keluar"
      cancel-text="Batal"
      variant="danger"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />

    <ProfilModal
      :show="showProfilModal"
      @close="showProfilModal = false"
    />
  </div>
</template>
