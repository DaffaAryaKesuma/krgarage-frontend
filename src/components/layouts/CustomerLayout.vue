<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUser, clearAuth } from "@/utils/auth";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import NotificationBell from "@/components/ui/NotificationBell.vue";

const router = useRouter();

// State
const isMobileMenuOpen = ref(false);
const showLogoutConfirm = ref(false);
const user = ref({ nama: "Guest", email: "" });

// Navigation Items
const navItems = [
  { label: "Dasbor", to: "/app/dashboard", icon: "mdi-view-dashboard" },
  { label: "Vespa Saya", to: "/app/my-vespas", icon: "mdi-motorbike" },
  { label: "Pemesanan", to: "/app/bookings", icon: "mdi-calendar-plus" },
  { label: "Riwayat", to: "/app/history", icon: "mdi-history" },
];

// Computed
const userInitials = computed(() => {
  const names = user.value.nama.split(" ");
  return names.length >= 2
    ? (names[0][0] + names[1][0]).toUpperCase()
    : user.value.nama.substring(0, 1).toUpperCase();
});

// Functions
const handleLogout = () => {
  clearAuth();
  router.push("/");
  showLogoutConfirm.value = false;
};

const closeMenu = () => {
  isMobileMenuOpen.value = false;
};

// Lifecycle
onMounted(() => {
  const storedUser = getCurrentUser();
  if (storedUser) {
    user.value = storedUser;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link
            to="/app/dashboard"
            class="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src="@/assets/logo.png" alt="KRGarage" class="h-10 w-10" />
            <div class="hidden sm:block">
              <span class="text-xl font-bold text-gray-900">KRGarage</span>
              <p class="text-xs text-gray-500">Manajemen Servis</p>
            </div>
          </router-link>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-1">
            <!-- Navigation Links -->
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
            >
              <i :class="`mdi ${item.icon} mr-2`"></i>{{ item.label }}
            </router-link>

            <!-- Divider -->
            <div class="h-8 w-px bg-gray-300 mx-2"></div>

            <!-- User Section -->
            <div class="flex items-center gap-3 sm:gap-4">
              <!-- Notification Bell -->
              <NotificationBell />

              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-gray-900">
                  {{ user.nama }}
                </p>
                <p class="text-xs text-red-600 font-medium">Pelanggan</p>
              </div>
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold"
              >
                {{ userInitials }}
              </div>
              <button
                @click="showLogoutConfirm = true"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Keluar"
              >
                <i class="mdi mdi-logout text-xl text-gray-700"></i>
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <i class="mdi mdi-menu text-2xl text-gray-700"></i>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="isMobileMenuOpen" class="md:hidden pb-4 space-y-1">
          <!-- User Info Mobile -->
          <div
            class="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2"
          >
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold"
            >
              {{ userInitials }}
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-900">{{ user.nama }}</p>
              <p class="text-xs text-gray-500">Pelanggan</p>
            </div>
            <!-- Notification Bell Mobile -->
            <NotificationBell />
          </div>

          <!-- Mobile Navigation Links -->
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="closeMenu"
            class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <i :class="`mdi ${item.icon} mr-2`"></i>{{ item.label }}
          </router-link>

          <!-- Logout Button Mobile -->
          <button
            @click="showLogoutConfirm = true"
            class="w-full text-left px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
          >
            <i class="mdi mdi-logout mr-2"></i>Keluar
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>

    <!-- Confirmation Modal -->
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
