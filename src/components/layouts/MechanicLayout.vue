<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUser, clearAuth } from "@/utils/auth";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import NotificationBell from "@/components/ui/NotificationBell.vue";

const router = useRouter();
const user = ref({ nama: "Guest", email: "" });
const showMobileMenu = ref(false);
const showLogoutConfirm = ref(false);

const userInitials = computed(() => {
  const [first, second] = user.value.nama?.split(" ") || [];
  return ((first?.[0] || "") + (second?.[0] || "")).toUpperCase();
});

const handleLogout = () => {
  clearAuth();
  router.push("/");
  showLogoutConfirm.value = false;
};

onMounted(() => {
  const storedUser = getCurrentUser();
  if (storedUser) {
    user.value = storedUser;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <router-link to="/mechanic/dashboard" class="flex items-center gap-2">
            <img src="@/assets/logo.png" alt="KRGarage" class="h-10 w-10" />
            <div class="hidden sm:block">
              <span class="text-xl font-bold text-gray-900">KRGarage</span>
              <p class="text-xs text-gray-500">Panel Mekanik</p>
            </div>
          </router-link>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-6">
            <div class="h-8 w-px bg-gray-300"></div>

            <div class="flex items-center gap-4">
              <!-- Notification Bell -->
              <NotificationBell />

              <div class="hidden sm:block text-right">
                <p class="text-sm font-semibold text-gray-900">
                  {{ user.nama }}
                </p>
                <p class="text-xs text-red-600 font-medium">Mekanik</p>
              </div>

              <div
                class="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold flex items-center justify-center"
              >
                {{ userInitials }}
              </div>

              <button
                @click="showLogoutConfirm = true"
                class="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Keluar"
              >
                <i class="mdi mdi-logout text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            v-if="showMobileMenu"
            @click="showMobileMenu = false"
            class="md:hidden p-2 text-gray-700"
          >
            <i class="mdi mdi-close text-2xl"></i>
          </button>
          <button
            v-else
            @click="showMobileMenu = true"
            class="md:hidden p-2 text-gray-700"
          >
            <i class="mdi mdi-menu text-2xl"></i>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="md:hidden border-t bg-white pb-4">
          <div class="px-4 py-4 space-y-3">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex-1">
                <p class="text-sm font-bold text-gray-800">{{ user.nama }}</p>
                <p class="text-xs text-red-600">Mekanik</p>
              </div>
              <!-- Notification Bell Mobile -->
              <NotificationBell />
            </div>
            <button
              @click="
                showLogoutConfirm = true;
                showMobileMenu = false;
              "
              class="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <i class="mdi mdi-logout mr-3"></i>
              Keluar
            </button>
          </div>
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
