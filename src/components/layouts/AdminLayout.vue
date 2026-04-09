<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUser, clearAuth } from "@/utils/auth";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import NotificationBell from "@/components/ui/NotificationBell.vue";

const router = useRouter();
const isMobileMenuOpen = ref(false);
const showLogoutConfirm = ref(false);

const user = ref({ nama: "Guest", email: "" });

// Menu items configuration
const menuItems = [
  { name: "Dasbor", path: "/admin/dashboard", icon: "mdi-view-dashboard" },
  { name: "Pemesanan", path: "/admin/bookings", icon: "mdi-clipboard-list" },
  { name: "Layanan", path: "/admin/services", icon: "mdi-wrench" },
  { name: "Inventaris", path: "/admin/inventory", icon: "mdi-package-variant" },
  { name: "Laporan", path: "/admin/financial-report", icon: "mdi-chart-line" },
];

// Computed properties
const userInitials = computed(() => {
  const names = user.value.nama.split(" ");
  return names.length >= 2
    ? (names[0][0] + names[1][0]).toUpperCase()
    : user.value.nama.charAt(0).toUpperCase();
});

// Functions
const handleLogout = () => {
  clearAuth();
  showLogoutConfirm.value = false;
  router.push("/");
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
    <!-- Navigation -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Nav Container -->
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link
            to="/admin/dashboard"
            class="flex items-center gap-2 no-underline"
          >
            <img src="@/assets/logo.png" alt="KRGarage" class="h-10 w-10" />
            <div class="hidden sm:block">
              <p class="text-xl font-bold text-gray-900">KRGarage</p>
              <p class="text-xs text-gray-500">Panel Admin</p>
            </div>
          </router-link>

          <!-- Desktop Menu -->
          <div class="hidden lg:flex items-center space-x-1">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium no-underline flex items-center gap-2"
            >
              <i :class="['mdi', item.icon]"></i>
              <span>{{ item.name }}</span>
            </router-link>

            <div class="h-8 w-px bg-gray-300 mx-2"></div>

            <!-- User Profile -->
            <div class="flex items-center gap-3 sm:gap-4 ml-2">
              <!-- Notification Bell -->
              <NotificationBell />

              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-gray-900">
                  {{ user.nama }}
                </p>
                <p class="text-xs text-red-600 font-medium">Admin</p>
              </div>

              <!-- Avatar -->
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm"
              >
                {{ userInitials }}
              </div>

              <!-- Logout Button -->
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
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i class="mdi mdi-menu text-2xl text-gray-700"></i>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="isMobileMenuOpen" class="lg:hidden pb-4 space-y-1">
          <!-- Mobile User Profile -->
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
              <p class="text-xs text-gray-500">Admin</p>
            </div>
            <!-- Notification Bell Mobile -->
            <NotificationBell />
          </div>

          <!-- Mobile Menu Items -->
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            @click="closeMenu"
            class="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium no-underline w-full"
          >
            <i :class="['mdi', item.icon]"></i>
            <span>{{ item.name }}</span>
          </router-link>

          <!-- Mobile Logout Button -->
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

    <!-- Main Content -->
    <main>
      <router-view />
    </main>

    <!-- Logout Confirmation Modal -->
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
