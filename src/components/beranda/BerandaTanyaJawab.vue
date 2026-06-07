<script setup lang="ts">
// ref dipakai untuk menyimpan status buka/tutup tiap FAQ.
import { ref } from "vue";

// Data dasar FAQ.
type FaqItem = {
  question: string;
  answer: string;
};

// Data FAQ di UI ditambah property open untuk accordion.
type FaqAnimatedItem = FaqItem & {
  open: boolean;
};

// Daftar pertanyaan dan jawaban bersifat statis.
const FAQS: FaqItem[] = [
  {
    question: "Berapa lama waktu servis yang dibutuhkan?",
    answer:
      "Tergantung jenis servisnya. Servis rutin biasanya 2-3 jam, sementara overhaul mesin bisa memakan waktu 2-5 hari kerja.",
  },
  {
    question: "Apakah ada garansi untuk servis?",
    answer:
      "Ya, kami memberikan garansi 30 hari untuk semua jenis servis dan 90 hari untuk penggantian sukucadang original.",
  },
  {
    question: "Apakah bisa servis di tempat (beranda layanan)?",
    answer:
      "Untuk saat ini kami hanya melayani servis di bengkel. Namun kami menyediakan layanan antar jemput gratis dalam radius 5km.",
  },
  {
    question: "Metode pembayaran apa saja yang diterima?",
    answer: "Kami menerima pembayaran tunai dan transfer bank.",
  },
  {
    question: "Apakah tersedia sukucadang original?",
    answer:
      "Ya, kami menyediakan sukucadang original dan aftermarket berkualitas. Kami akan merekomendasikan yang terbaik sesuai kebutuhan dan budget Anda.",
  },
];

// Semua FAQ awalnya tertutup.
const faqs = ref<FaqAnimatedItem[]>(FAQS.map((f) => ({ ...f, open: false })));

// Membuka atau menutup satu item FAQ.
const toggleFAQ = (index: number) => {
  faqs.value[index].open = !faqs.value[index].open;
};
</script>

<template>
  <!-- Section pertanyaan yang sering diajukan. -->
  <section class="bg-white py-12 md:py-20 px-4 md:px-8 lg:px-20">
    <div class="mx-auto max-w-4xl">
      <!-- Judul section. -->
      <h2 class="mb-4 text-center text-2xl md:text-4xl font-bold text-gray-800">
        Pertanyaan yang Sering Diajukan
      </h2>
      <p class="mb-12 text-center text-gray-600 max-w-2xl mx-auto">
        Temukan jawaban untuk pertanyaan umum tentang layanan kami
      </p>
      <div class="space-y-4">
        <!-- Item FAQ berbentuk accordion. -->
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="border border-gray-200 rounded-lg overflow-hidden hover:border-red-300 transition-colors"
        >
          <!-- Tombol pertanyaan mengubah status open. -->
          <button
            @click="toggleFAQ(i)"
            class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between gap-4"
          >
            <span class="font-semibold text-gray-800 flex-1">{{
              faq.question
            }}</span>
            <i
              :class="[
                'mdi mdi-chevron-down text-2xl text-gray-600 transition-transform duration-300',
                { 'rotate-180': faq.open },
              ]"
            ></i>
          </button>
          <!-- Jawaban tampil dengan transisi saat FAQ dibuka. -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div
              v-show="faq.open"
              class="px-6 py-4 bg-gray-50 border-t border-gray-200"
            >
              <p class="text-gray-600 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>
