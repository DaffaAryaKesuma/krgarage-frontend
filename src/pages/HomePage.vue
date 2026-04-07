<script setup lang="ts">
import { ref } from "vue";

import HomeHeader from "@/components/home/HomeHeader.vue";
import HomeHero from "@/components/home/HomeHero.vue";
import HomeStats from "@/components/home/HomeStats.vue";
import HomeWhyChooseUs from "@/components/home/HomeWhyChooseUs.vue";
import HomeServices from "@/components/home/HomeServices.vue";
import HomeFaq from "@/components/home/HomeFaq.vue";
import HomeAbout from "@/components/home/HomeAbout.vue";

import LoginModal from "@/components/home/LoginModal.vue";
import RegisterModal from "@/components/home/RegisterModal.vue";
import PublicFooter from "@/components/home/PublicFooter.vue";

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
    <HomeHeader @open-login="openLogin" @open-register="openRegister" />

    <HomeHero @order="handleOrder" />

    <HomeStats />

    <HomeWhyChooseUs />

    <HomeServices @order="handleOrder" />

    <HomeFaq />

    <HomeAbout />

    <PublicFooter />

    <LoginModal
      :open="isLoginModalOpen"
      @close="isLoginModalOpen = false"
      @openRegister="
        isLoginModalOpen = false;
        isRegisterModalOpen = true;
      "
    />
    <RegisterModal
      :open="isRegisterModalOpen"
      @close="isRegisterModalOpen = false"
    />
  </div>
</template>
