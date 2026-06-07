<script setup lang="ts">
// Modal konfirmasi untuk logout.
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
// Lonceng notifikasi di navbar.
import NotificationBell from "@/components/ui/NotificationBell/NotificationBell.vue";
// Modal profil pengguna.
import ProfilModal from "@/components/ui/ProfilModal/ProfilModal.vue";
// Composable berisi state dan aksi umum layout login.
import { useAuthenticatedLayoutShell } from "./useAuthenticatedLayoutShell";
// Mengunci scroll saat drawer mobile terbuka.
import { scrollLock } from "@/composables/scrollLock";
// Helper format nama user.
import { formatNama } from "@/utils/format";
// Helper badge role.
import { getRoleBadgeClass } from "@/utils/badgeVariants";
// Helper class tombol.
import {
  getButtonClass,
  getFullWidthButtonClass,
  getIconButtonClass,
} from "@/utils/buttonVariants";

// Struktur item navigasi yang dikirim dari layout role.
interface NavItem {
  label: string;
  to: string;
  icon: string;
}

// Props membuat layout ini bisa dipakai ulang oleh pelanggan/admin/mekanik/pemilik.
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

// Default props untuk tampilan layout.
const props = withDefaults(defineProps<Props>(), {
  appTitle: "KRGarage",
  appSubtitle: "",
  desktopBreakpoint: "md",
  rootClass: "min-h-screen bg-gray-50",
  navClass: "bg-white shadow-md sticky top-0 z-50",
  navItems: () => [],
});

// Ambil state menu, user, logout, dan helper route dari composable.
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
  route,
} = useAuthenticatedLayoutShell(props.desktopBreakpoint);

// Saat menu mobile terbuka, body tidak bisa discroll.
scrollLock(() => isMobileMenuOpen.value);

// Class avatar profil di navbar dan drawer.
const PROFILE_AVATAR_CLASS =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 text-sm font-bold text-white shadow-md transition-all hover:ring-4 hover:ring-red-100";

// Mengambil class badge berdasarkan role layout.
const roleBadgeClass = () => getRoleBadgeClass(props.roleLabel);

// Class link navigasi desktop, aktif jika route sesuai.
const navItemClass = (to: string) =>
  [
    "group whitespace-nowrap no-underline duration-200 lg:px-3 xl:px-4",
    getButtonClass(isActive(to) ? "primary" : "ghost", "sm"),
    isActive(to)
      ? "shadow-sm shadow-red-100/50"
      : "text-gray-700 hover:text-red-600",
  ].join(" ");

// Class ikon navigasi desktop.
const navIconClass = (to: string, icon: string) =>
  [
    "mdi shrink-0 text-base transition-colors duration-200",
    icon,
    isActive(to) ? "text-white" : "text-gray-500 group-hover:text-red-600",
  ].join(" ");

// Class link navigasi mobile.
const mobileNavItemClass = (to: string) =>
  [
    "group w-full justify-start gap-3 rounded-lg px-4 py-3 no-underline duration-200",
    getButtonClass(isActive(to) ? "primary" : "ghost", "md"),
    isActive(to)
      ? "shadow-sm shadow-red-100/30"
      : "text-gray-700 hover:text-red-600",
  ].join(" ");

// Class ikon navigasi mobile.
const mobileNavIconClass = (to: string, icon: string) =>
  [
    "mdi text-xl transition-colors duration-200",
    icon,
    isActive(to) ? "text-white" : "text-gray-500 group-hover:text-red-600",
  ].join(" ");
</script>

<template>
  <!-- Root layout untuk semua halaman yang sudah login. -->
  <div :class="rootClass">
    <!-- Navbar atas. -->
    <nav :class="navClass">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-2 lg:gap-4">
          <!-- Logo mengarah ke dashboard role. -->
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

          <!-- Menu desktop dan area profil. -->
          <div
            :class="[
              breakpointClasses.desktopMenu,
              'min-w-0 flex-1 items-center justify-end gap-1',
            ]"
          >
            <!-- Link navigasi desktop. -->
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :class="navItemClass(item.to)"
            >
              <i :class="navIconClass(item.to, item.icon)"></i>
              <span>{{ item.label }}</span>
            </router-link>

            <!-- Garis pemisah menu dengan area profil. -->
            <div
              v-if="navItems.length"
              class="mx-1 hidden h-8 w-px bg-gray-300 xl:block"
            ></div>

            <div
              class="flex items-center gap-2 sm:gap-3"
              :class="{ 'ml-1 lg:ml-2': navItems.length }"
            >
              <!-- Notifikasi user. -->
              <NotificationBell />

              <!-- Nama dan role hanya tampil di layar lebar. -->
              <div class="hidden flex-col items-end justify-center text-right xl:flex">
                <span class="text-sm font-bold text-gray-900 leading-tight">
                  {{ formatNama(user.nama) }}
                </span>
                <span
                  :class="[
                    'inline-flex items-center rounded border text-[9px] font-bold uppercase px-1.5 py-[1.5px] leading-none mt-1 shadow-sm',
                    roleBadgeClass(),
                  ]"
                >
                  {{ roleLabel }}
                </span>
              </div>

              <!-- Avatar membuka modal profil. -->
              <button
                type="button"
                :class="PROFILE_AVATAR_CLASS"
                @click="showProfilModal = true"
                title="Lihat Profil"
              >
                {{ userInitials }}
              </button>

              <!-- Tombol logout membuka modal konfirmasi. -->
              <button
                @click="showLogoutConfirm = true"
                :class="getIconButtonClass('neutral', 'md', 'shrink-0')"
                title="Keluar"
              >
                <i class="mdi mdi-logout text-xl text-gray-700"></i>
              </button>
            </div>
          </div>

          <!-- Tombol hamburger untuk menu mobile. -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            :class="[
              breakpointClasses.mobileMenuButton,
              getIconButtonClass('neutral', 'md', 'shrink-0'),
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

    <!-- Overlay gelap di belakang drawer mobile. -->
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

    <!-- Drawer menu mobile dari kanan. -->
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
        <!-- Header drawer mobile. -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Menu</h2>
          <button
            @click="closeMenu"
            :class="getIconButtonClass('neutral', 'md', 'hover:text-red-700')"
          >
            <i class="mdi mdi-close text-2xl"></i>
          </button>
        </div>

        <!-- Kartu profil user di drawer mobile. -->
        <div
          class="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-6 border border-gray-100"
        >
          <button
            type="button"
            :class="PROFILE_AVATAR_CLASS"
            @click="
              showProfilModal = true;
              closeMenu();
            "
          >
            {{ userInitials }}
          </button>
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <span class="text-sm font-bold text-gray-900 truncate leading-tight">
              {{ formatNama(user.nama) }}
            </span>
            <span
              :class="[
                'inline-flex items-center rounded border text-[9px] font-bold uppercase px-1.5 py-[1.5px] leading-none mt-1 shadow-sm max-w-max',
                roleBadgeClass(),
              ]"
            >
              {{ roleLabel }}
            </span>
          </div>
          <NotificationBell />
        </div>

        <!-- Link navigasi mobile. -->
        <nav class="flex flex-col gap-2 mb-6 flex-1 overflow-y-auto">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="closeMenu"
            :class="mobileNavItemClass(item.to)"
          >
            <i
              :class="mobileNavIconClass(item.to, item.icon)"
            ></i>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Tombol logout di bagian bawah drawer. -->
        <div class="pt-4">
          <button
            @click="
              showLogoutConfirm = true;
              closeMenu();
            "
            :class="getFullWidthButtonClass('danger', 'lg')"
          >
            <i class="mdi mdi-logout text-lg"></i>
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- Konten halaman aktif milik role saat ini. -->
    <main class="content-safe">
      <router-view :key="route.fullPath" />
    </main>

    <!-- Modal konfirmasi sebelum logout. -->
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

    <!-- Modal profil user. -->
    <ProfilModal
      :show="showProfilModal"
      @close="showProfilModal = false"
    />
  </div>
</template>
