<script setup lang="ts">
import { ref } from "vue";

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

const isLoginModalOpen = ref(false);
const isRegisterModalOpen = ref(false);

const openLogin = () => {
  isLoginModalOpen.value = true;
};

const openRegister = () => {
  isRegisterModalOpen.value = true;
};

const handleOrder = () => {
  openLogin();
};
</script>

<template>
  <div class="font-sans">
    <BerandaNavigasi @open-login="openLogin" @open-register="openRegister" />

    <BerandaUtama @order="handleOrder" />

    <BerandaStatistik />

    <BerandaKeunggulan />

    <BerandaLayanan @order="handleOrder" />

    <BerandaTanyaJawab />

    <BerandaTentang />

    <BerandaFooter />

    <MasukModal
      :open="isLoginModalOpen"
      @close="isLoginModalOpen = false"
      @openRegister="
        isLoginModalOpen = false;
        isRegisterModalOpen = true;
      "
    />
    <DaftarModal
      :open="isRegisterModalOpen"
      @close="isRegisterModalOpen = false"
    />
  </div>
</template>
