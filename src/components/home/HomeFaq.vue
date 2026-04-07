<script setup lang="ts">
import { ref } from "vue";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAnimatedItem = FaqItem & {
  open: boolean;
};

const FAQS: FaqItem[] = [
  {
    question: "Berapa lama waktu servis yang dibutuhkan?",
    answer:
      "Tergantung jenis servisnya. Servis rutin biasanya 2-3 jam, sementara overhaul mesin bisa memakan waktu 2-5 hari kerja.",
  },
  {
    question: "Apakah ada garansi untuk servis?",
    answer:
      "Ya, kami memberikan garansi 30 hari untuk semua jenis servis dan 90 hari untuk penggantian sparepart original.",
  },
  {
    question: "Apakah bisa servis di tempat (home service)?",
    answer:
      "Untuk saat ini kami hanya melayani servis di bengkel. Namun kami menyediakan layanan antar jemput gratis dalam radius 5km.",
  },
  {
    question: "Metode pembayaran apa saja yang diterima?",
    answer: "Kami menerima pembayaran tunai dan transfer bank.",
  },
  {
    question: "Apakah tersedia sparepart original?",
    answer:
      "Ya, kami menyediakan sparepart original dan aftermarket berkualitas. Kami akan merekomendasikan yang terbaik sesuai kebutuhan dan budget Anda.",
  },
];

const faqs = ref<FaqAnimatedItem[]>(FAQS.map((f) => ({ ...f, open: false })));

const toggleFAQ = (index: number) => {
  faqs.value[index].open = !faqs.value[index].open;
};
</script>

<template>
  <!-- FAQ Section -->
  <section class="bg-white py-12 md:py-20 px-4 md:px-8 lg:px-20">
    <div class="mx-auto max-w-4xl">
      <h2 class="mb-4 text-center text-2xl md:text-4xl font-bold text-gray-800">
        Pertanyaan yang Sering Diajukan
      </h2>
      <p class="mb-12 text-center text-gray-600 max-w-2xl mx-auto">
        Temukan jawaban untuk pertanyaan umum tentang layanan kami
      </p>
      <div class="space-y-4">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="border border-gray-200 rounded-lg overflow-hidden hover:border-red-300 transition-colors"
        >
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
