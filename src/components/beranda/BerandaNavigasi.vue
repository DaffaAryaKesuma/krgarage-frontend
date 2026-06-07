<script setup lang="ts">
// ref dipakai untuk buka/tutup menu mobile.
import { ref } from "vue";
// Mengunci scroll body saat drawer mobile terbuka.
import { scrollLock } from "@/composables/scrollLock";

// Link navigasi anchor ke bagian-bagian di halaman beranda.
const NAV_LINKS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Layanan", href: "#layanan" },
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Kontak", href: "#kontak" },
];

// Event dikirim ke parent untuk membuka modal login atau daftar.
const emit = defineEmits<{
  (e: "openLogin"): void;
  (e: "openRegister"): void;
}>();

// State drawer mobile.
const isMobileMenuOpen = ref(false);

// Saat menu mobile terbuka, halaman belakang tidak bisa discroll.
scrollLock(() => isMobileMenuOpen.value);

// Menutup menu mobile.
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <!-- Header/navbar publik beranda. -->
  <header
    class="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-8 md:px-20 shadow-sm"
  >
    <!-- Logo dan nama brand. -->
    <div class="flex items-center text-2xl font-bold">
      <img src="@/assets/logo.png" alt="KRGarage Logo" class="mr-3 h-10" />
      <span>KRGarage</span>
    </div>

    <!-- Menu desktop memakai anchor ke section di halaman yang sama. -->
    <nav class="hidden items-center gap-10 md:flex">
      <a
        v-for="link in NAV_LINKS"
        :key="link.href"
        :href="link.href"
        class="font-medium text-gray-700 transition-colors hover:text-red-700"
      >
        {{ link.label }}
      </a>
    </nav>

    <!-- Tombol auth desktop membuka modal dari parent. -->
    <div class="hidden items-center gap-4 md:flex">
      <button
        @click="emit('openLogin')"
        class="px-5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
      >
        Masuk
      </button>
      <button
        @click="emit('openRegister')"
        class="px-5 py-2 rounded-lg bg-red-700 text-sm font-medium text-white hover:bg-red-800 transition"
      >
        Daftar
      </button>
    </div>

    <!-- Tombol hamburger hanya tampil di mobile. -->
    <button
      v-if="!isMobileMenuOpen"
      @click="isMobileMenuOpen = true"
      class="md:hidden p-2 -mr-2 text-gray-700 hover:text-red-700 transition"
    >
      <i class="mdi mdi-menu text-2xl"></i>
    </button>
  </header>

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
      class="fixed inset-0 z-40 bg-black/60 md:hidden"
      @click="closeMobileMenu"
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
      class="fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm bg-white p-6 md:hidden shadow-2xl flex flex-col border-l border-gray-100"
    >
      <!-- Header drawer mobile. -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Menu</h2>
        <button
          @click="closeMobileMenu"
          class="p-2 text-gray-500 hover:text-red-700 transition"
        >
          <i class="mdi mdi-close text-2xl"></i>
        </button>
      </div>

      <!-- Link mobile menutup drawer setelah diklik. -->
      <nav class="flex flex-col gap-4 mb-8 border-b pb-6">
        <a
          v-for="link in NAV_LINKS"
          :key="link.href"
          :href="link.href"
          @click="closeMobileMenu"
          class="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
        >
          {{ link.label }}
        </a>
      </nav>
      <!-- Tombol login mobile. -->
      <button
        @click="
          emit('openLogin');
          closeMobileMenu();
        "
        class="w-full px-5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-100 transition mb-3"
      >
        Masuk
      </button>
      <!-- Tombol daftar mobile. -->
      <button
        @click="
          emit('openRegister');
          closeMobileMenu();
        "
        class="w-full px-5 py-2 rounded-lg bg-red-700 text-sm font-medium text-white hover:bg-red-800 transition"
      >
        Daftar
      </button>
    </div>
  </transition>
</template>
