<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_URL } from "@/utils/api";
import { getCurrentUser, clearAuth, getAuthHeaders } from "@/utils/auth";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import NotificationBell from "@/components/ui/NotificationBell.vue";

interface NavItem {
  label: string;
  to: string;
  icon: string;
}

interface Props {
  homePath: string;
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

const router = useRouter();
const isMobileMenuOpen = ref(false);
const showLogoutConfirm = ref(false);
const user = ref({ nama: "Guest", email: "" });

const userInitials = computed(() => {
  const names = user.value.nama.trim().split(" ").filter(Boolean);
  return names.length >= 2
    ? (names[0][0] + names[1][0]).toUpperCase()
    : user.value.nama.charAt(0).toUpperCase();
});

const breakpointClasses = computed(() => {
  if (props.desktopBreakpoint === "xl") {
    return {
      desktopMenu: "hidden xl:flex",
      mobileMenuButton: "xl:hidden",
      mobileMenu: "xl:hidden",
    };
  }

  if (props.desktopBreakpoint === "lg") {
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
</script>

<template>
  <div :class="rootClass">
    <nav :class="navClass">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between gap-2 lg:gap-4">
          <router-link
            :to="homePath"
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
              class="inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 no-underline lg:px-3 xl:px-4"
            >
              <i :class="['mdi shrink-0', item.icon]"></i>
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
                  {{ user.nama }}
                </p>
                <p class="text-xs text-red-600 font-medium">{{ roleLabel }}</p>
              </div>

              <div
                class="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm"
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

        <div
          v-if="isMobileMenuOpen"
          :class="[breakpointClasses.mobileMenu, 'pb-4 space-y-1']"
        >
          <div
            class="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2"
          >
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm"
            >
              {{ userInitials }}
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-900">{{ user.nama }}</p>
              <p class="text-xs text-gray-500">{{ roleLabel }}</p>
            </div>
            <NotificationBell />
          </div>

          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="closeMenu"
            class="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium no-underline w-full"
          >
            <i :class="['mdi', item.icon]"></i>
            <span>{{ item.label }}</span>
          </router-link>

          <button
            @click="showLogoutConfirm = true"
            class="flex items-center gap-2 w-full px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium mt-2"
          >
            <i class="mdi mdi-logout"></i>
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </nav>

    <main class="content-safe">
      <router-view />
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
  </div>
</template>
