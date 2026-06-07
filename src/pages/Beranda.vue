<script setup lang="ts">
// ref dipakai untuk mengatur modal login/register terbuka atau tertutup.
import { ref } from "vue";

// Komponen-komponen bagian landing page.
import BerandaNavigasi from "@/components/beranda/BerandaNavigasi.vue";
import BerandaUtama from "@/components/beranda/BerandaUtama.vue";
import BerandaStatistik from "@/components/beranda/BerandaStatistik/BerandaStatistik.vue";
import BerandaKeunggulan from "@/components/beranda/BerandaKeunggulan.vue";
import BerandaLayanan from "@/components/beranda/BerandaLayanan/BerandaLayanan.vue";
import BerandaTanyaJawab from "@/components/beranda/BerandaTanyaJawab.vue";
import BerandaTentang from "@/components/beranda/BerandaTentang.vue";

import MasukModal from "@/components/beranda/MasukModal/MasukModal.vue";
import DaftarModal from "@/components/beranda/DaftarModal/DaftarModal.vue";
import BerandaFooter from "@/components/beranda/BerandaFooter.vue";

// State modal login.
const isLoginModalOpen = ref(false);
// State modal daftar.
const isRegisterModalOpen = ref(false);

// Membuka modal login.
const openLogin = () => {
  isLoginModalOpen.value = true;
};

// Membuka modal daftar.
const openRegister = () => {
  isRegisterModalOpen.value = true;
};

// Tombol pesan di landing page diarahkan ke login dulu.
const handleOrder = () => {
  openLogin();
};
</script>

<template>
  <!-- Halaman beranda publik sebelum user login. -->
  <div class="font-sans">
    <!-- Navigasi atas membuka modal login atau daftar. -->
    <BerandaNavigasi @open-login="openLogin" @open-register="openRegister" />

    <!-- Hero utama beranda. -->
    <BerandaUtama @order="handleOrder" />

    <!-- Statistik singkat KRGarage. -->
    <BerandaStatistik />

    <!-- Keunggulan layanan. -->
    <BerandaKeunggulan />

    <!-- Daftar layanan publik, tombol order tetap membuka login. -->
    <BerandaLayanan @order="handleOrder" />

    <!-- Pertanyaan umum. -->
    <BerandaTanyaJawab />

    <!-- Bagian tentang bengkel. -->
    <BerandaTentang />

    <!-- Footer beranda. -->
    <BerandaFooter />

    <!-- Modal login. -->
    <MasukModal
      :open="isLoginModalOpen"
      @close="isLoginModalOpen = false"
      @openRegister="
        isLoginModalOpen = false;
        isRegisterModalOpen = true;
      "
    />
    <!-- Modal daftar akun. -->
    <DaftarModal
      :open="isRegisterModalOpen"
      @close="isRegisterModalOpen = false"
    />
  </div>
</template>
