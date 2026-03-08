<script setup lang="ts">
const currentYear = new Date().getFullYear();

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/krteamgarage",
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/6285375259103",
  },
];
</script>

<template>
  <footer id="contact-section" class="bg-red-800 pt-16 text-white print:hidden">
    <div
      class="mx-auto grid max-w-7xl gap-8 px-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div class="px-4">
        <h3 class="mb-4 text-lg font-semibold text-white">KRGarage</h3>
        <p class="mb-4 text-sm leading-relaxed">
          Bengkel spesialis Vespa 2-tak terpercaya di Pekanbaru. Kami
          menyediakan layanan servis, restorasi, dan tune-up untuk menjaga
          performa Vespa klasik Anda.
        </p>
      </div>

      <div class="px-4">
        <h3 class="mb-4 text-lg font-semibold text-white">Kontak Kami</h3>
        <p class="mb-4 text-sm leading-relaxed">
          <strong class="text-white">Alamat:</strong><br />
          Jalan K H Wahid Syahim Nomor 36, Sumahilang, Kec. Pekanbaru Kota<br />
          Pekanbaru, Riau, 28111
        </p>
        <p class="text-sm leading-relaxed">
          <strong class="text-white">Telepon/WA:</strong> 0853-7525-9103
        </p>
      </div>

      <div class="px-4">
        <h3 class="mb-4 text-lg font-semibold text-white">Ikuti Kami</h3>
        <div class="flex flex-col gap-2">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white transition-colors duration-200 hover:text-gray-300"
          >
            {{ link.name }}
          </a>
        </div>
      </div>
    </div>

    <div class="mt-12 border-t border-white/20 py-8 text-center">
      <p class="text-xs">
        &copy; {{ currentYear }} KRGarage. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>
