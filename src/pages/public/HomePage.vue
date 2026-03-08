<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { toIDR } from "../../utils/money";
import { formatWaktu, getImageUrl } from "../../utils/format";
import LoginModal from "@/components/public/LoginModal.vue";
import RegisterModal from "@/components/public/RegisterModal.vue";
import PublicFooter from "@/components/public/PublicFooter.vue";
import { useRouter } from "vue-router";
import { API_URL } from "@/utils/api";

// Navigation Links Config
const NAV_LINKS = [
  { label: "Beranda", href: "#hero-section-dark" },
  { label: "Layanan", href: "#services-section" },
  { label: "Tentang Kami", href: "#about-us-section" },
  { label: "Kontak", href: "#contact-section" },
];

// Definisikan tipe data untuk Service
interface Service {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number | null;
  gambar: string;
}

// Feature Highlights Config
const FEATURE_HIGHLIGHTS = [
  { icon: "mdi-shield-check", label: "Garansi Resmi" },
];

// Stats Counter Config
const STATS_CONFIG = [
  { target: 500, label: "Pelanggan Puas", suffix: "+" },
  { target: 8, label: "Tahun Pengalaman", suffix: "" },
  { target: 1200, label: "Servis Selesai", suffix: "+" },
  { target: 98, label: "Tingkat Kepuasan", suffix: "%" },
];

// Why Choose Us Cards
const WHY_CHOOSE_US = [
  {
    icon: "mdi-trophy",
    title: "Pengalaman Terbukti",
    desc: "8+ tahun pengalaman dengan prestasi juara di berbagai kompetisi balap Vespa regional",
  },
  {
    icon: "mdi-wrench",
    title: "Mekanik Ahli",
    desc: "Tim mekanik bersertifikat dengan spesialisasi mesin 2-tak dan Vespa klasik",
  },
  {
    icon: "mdi-check-circle",
    title: "Garansi Servis",
    desc: "Garansi 30 hari untuk servis dan 90 hari untuk spare part original",
  },
  {
    icon: "mdi-cash-multiple",
    title: "Harga Transparan",
    desc: "Harga jelas tanpa biaya tersembunyi",
  },
  {
    icon: "mdi-car",
    title: "Antar Jemput Gratis",
    desc: "Layanan antar jemput gratis dalam radius 5km untuk kemudahan Anda",
  },
  {
    icon: "mdi-cellphone",
    title: "Pemesanan Online",
    desc: "Sistem pemesanan online 24/7, pilih jadwal sesuai keinginan Anda dengan mudah",
  },
];

// Testimonials Config
const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    role: "Pemilik Vespa PX 150",
    rating: 5,
    icon: "mdi-account",
    text: "Pelayanan sangat memuaskan! Vespa PX saya yang sudah lama tidak bisa dihidupkan, sekarang kembali seperti baru. Tim KRGarage sangat profesional dan ramah.",
  },
  {
    name: "Andi Wijaya",
    role: "Pemilik Vespa Sprint",
    rating: 5,
    icon: "mdi-account",
    text: "Saya sangat puas dengan hasil servisnya. Mesin jadi lebih halus dan responsif. Harga juga sangat terjangkau. Highly recommended!",
  },
  {
    name: "Siti Nurhaliza",
    role: "Pemilik Vespa Super",
    rating: 5,
    icon: "mdi-account",
    text: "KRGarage adalah bengkel Vespa terbaik di Pekanbaru! Mekaniknya sangat berpengalaman dan paham betul tentang mesin 2-tak. Puas banget!",
  },
];

// Racing Achievements Config
const ACHIEVEMENTS = [
  { rank: "1st", title: "Juara 1 - Sumatera Cup Prix Bengkulu", year: "2024" },
  { rank: "3rd", title: "Podium 3 - Sumatera Cup Prix Bengkulu", year: "2024" },
  { rank: "3rd", title: "Podium 3 - A2 Drag Race & Drag Bike", year: "2023" },
  { rank: "3rd", title: "Podium 3 - Sumatera Cup Prix Siak", year: "2023" },
  { rank: "1st", title: "Juara 1 - Riau Cup Prix", year: "2023" },
  { rank: "3rd", title: "Podium 3 - The Brotos Seri 2", year: "2022" },
];

// FAQ Config
const FAQS = [
  {
    question: "Berapa lama waktu servis yang dibutuhkan?",
    answer:
      "Tergantung jenis servisnya. Servis rutin biasanya 2-3 jam, sementara overhaul mesin bisa memakan waktu 2-5 hari kerja.",
  },
  {
    question: "Apakah ada garansi untuk servis?",
    answer:
      "Ya, kami memberikan garansi 30 hari untuk semua jenis servis dan 90 hari untuk penggantian spare part original.",
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
    question: "Apakah tersedia spare part original?",
    answer:
      "Ya, kami menyediakan spare part original dan aftermarket berkualitas. Kami akan merekomendasikan yang terbaik sesuai kebutuhan dan budget Anda.",
  },
];

const services = ref<Service[]>([]);
const isLoading = ref(true);
const isMobileMenuOpen = ref(false);
const isLoginModalOpen = ref(false);
const isRegisterModalOpen = ref(false);
const router = useRouter();

const stats = ref(STATS_CONFIG.map((s) => ({ ...s, value: 0 })));
const faqs = ref(FAQS.map((f) => ({ ...f, open: false })));

const handleServiceClick = () => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push("/app/bookings");
  } else {
    isLoginModalOpen.value = true;
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const toggleFAQ = (index: number) => {
  faqs.value[index].open = !faqs.value[index].open;
};

// Animasi statistik
const animateStats = () => {
  stats.value.forEach((stat) => {
    const duration = 2000;
    const increment = stat.target / (duration / 16);
    const timer = setInterval(() => {
      if (stat.value < stat.target) {
        stat.value = Math.min(stat.value + increment, stat.target);
      } else {
        stat.value = stat.target;
        clearInterval(timer);
      }
    }, 16);
  });
};

onMounted(async () => {
  // Fetch services
  try {
    const response = await axios.get(`${API_URL}/services`);
    services.value = response.data.map((s: any) => ({
      ...s,
      gambar: getImageUrl(s.gambar, API_URL),
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
  } finally {
    isLoading.value = false;
  }

  // Trigger stats animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 },
  );

  const statsSection = document.getElementById("stats-section");
  if (statsSection) observer.observe(statsSection);
});
</script>

<template>
  <div class="font-sans">
    <!-- Header/Navbar -->
    <header
      class="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-8 md:px-20 shadow-sm"
    >
      <div class="flex items-center text-2xl font-bold">
        <img src="@/assets/logo.png" alt="KRGarage Logo" class="mr-3 h-10" />
        <span>KRGarage</span>
      </div>

      <!-- Desktop Menu -->
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

      <!-- Auth Buttons -->
      <div class="hidden items-center gap-4 md:flex">
        <button
          @click="isLoginModalOpen = true"
          class="px-5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
        >
          Masuk
        </button>
        <button
          @click="isRegisterModalOpen = true"
          class="px-5 py-2 rounded-lg bg-red-700 text-sm font-medium text-white hover:bg-red-800 transition"
        >
          Daftar
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <button
        v-if="!isMobileMenuOpen"
        @click="isMobileMenuOpen = true"
        class="md:hidden p-2"
      >
        <i class="mdi mdi-menu text-2xl"></i>
      </button>
    </header>

    <!-- Mobile Menu Overlay -->
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

    <!-- Mobile Menu -->
    <transition
      enter-from-class="-translate-x-full"
      enter-active-class="transition-transform duration-300 ease-out"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-white p-6 md:hidden"
      >
        <h2 class="mb-6 text-xl font-bold">Menu</h2>
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
        <button
          @click="
            isLoginModalOpen = true;
            closeMobileMenu();
          "
          class="w-full px-5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-100 transition mb-3"
        >
          Masuk
        </button>
        <button
          @click="
            isRegisterModalOpen = true;
            closeMobileMenu();
          "
          class="w-full px-5 py-2 rounded-lg bg-red-700 text-sm font-medium text-white hover:bg-red-800 transition"
        >
          Daftar
        </button>
      </div>
    </transition>

    <!-- Hero Section -->
    <main
      id="hero-section-dark"
      class="relative flex min-h-screen items-center justify-center bg-gray-900 bg-cover bg-center px-4 pt-24 pb-16 md:px-8 text-center text-white overflow-hidden"
      style="background-image: url(&quot;/src/assets/homepage.png&quot;)"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"
      ></div>

      <!-- Animated BG Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute top-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 1s"
        ></div>
      </div>

      <div class="relative z-10 mx-auto max-w-4xl">
        <h1
          class="text-4xl font-extrabold md:text-6xl lg:text-7xl mb-6 leading-tight"
        >
          <span class="block">Perawatan Ahli untuk</span>
          <span
            class="block bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent"
          >
            Vespa Klasik Anda
          </span>
        </h1>

        <p
          class="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto"
        >
          Perawatan, penyetelan, dan restorasi mesin 2-tak profesional dengan
          garansi resmi. Berikan vespa Anda perawatan yang layak.
        </p>

        <!-- Feature Highlights -->
        <div class="flex flex-wrap justify-center gap-4 mt-8 mb-10">
          <div
            v-for="feature in FEATURE_HIGHLIGHTS"
            :key="feature.label"
            class="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all"
          >
            <i :class="['mdi', feature.icon, 'text-red-400 text-xl']"></i>
            <span class="text-sm font-semibold">{{ feature.label }}</span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
        >
          <button
            @click="isLoginModalOpen = true"
            class="group relative px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto overflow-hidden"
          >
            <span class="relative z-10 flex items-center justify-center gap-2">
              Pesan Sekarang
              <i
                class="mdi mdi-arrow-right text-xl group-hover:translate-x-1 transition-transform"
              ></i>
            </span>
          </button>

          <a
            href="#services-section"
            class="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-lg hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Lihat Layanan
            <i class="mdi mdi-chevron-down text-xl"></i>
          </a>
        </div>
      </div>
    </main>

    <!-- Stats Section -->
    <section id="stats-section" class="bg-white py-12 md:py-16">
      <div class="mx-auto max-w-7xl px-4 md:px-8">
        <div class="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
          <div v-for="(stat, i) in stats" :key="i" class="text-center">
            <div class="text-3xl md:text-5xl font-bold text-red-700 mb-2">
              {{ Math.round(stat.value) }}{{ stat.suffix }}
            </div>
            <div class="text-sm md:text-base text-gray-600 font-medium">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="bg-gray-50 py-12 md:py-20 px-4 md:px-8 lg:px-20">
      <div class="mx-auto max-w-7xl">
        <h2
          class="mb-4 text-center text-2xl md:text-4xl font-bold text-gray-800"
        >
          Mengapa Memilih KRGarage?
        </h2>
        <p class="mb-12 text-center text-gray-600 max-w-2xl mx-auto">
          Kami tidak hanya servis Vespa, tapi merawat passion Anda dengan
          dedikasi penuh
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="item in WHY_CHOOSE_US"
            :key="item.title"
            class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
          >
            <div class="text-red-600 mb-4">
              <i :class="['mdi', item.icon, 'text-5xl']"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">
              {{ item.title }}
            </h3>
            <p class="text-gray-600">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section
      id="services-section"
      class="relative bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 px-4 md:px-8 lg:px-20 overflow-hidden"
    >
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-20 -z-10"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-20 -z-10"
      ></div>

      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Layanan Unggulan Kami
          </h2>
          <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Dari perawatan rutin hingga modifikasi performa, kami siap
            memberikan yang terbaik untuk Vespa kesayangan Anda
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-600">Memuat layanan...</p>
        </div>

        <!-- Services Grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            v-for="s in services"
            :key="s.id"
            @click="handleServiceClick"
            class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
          >
            <!-- Service gambar with Overlay -->
            <div class="relative h-56 overflow-hidden">
              <img
                :src="s.gambar"
                :alt="s.nama_layanan"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <h3
                  class="text-2xl font-bold text-white mb-2 group-hover:translate-y-[-4px] transition-transform duration-300"
                >
                  {{ s.nama_layanan }}
                </h3>
              </div>
            </div>

            <!-- Service Details -->
            <div class="p-6 bg-white">
              <p
                class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3"
              >
                {{ s.deskripsi }}
              </p>

              <!-- Estimasi Info -->
              <div
                class="bg-gray-100 p-2.5 rounded mb-4 flex justify-between gap-2 text-sm"
              >
                <div>
                  <p class="text-gray-600">Estimasi Harga</p>
                  <p class="font-bold text-red-600">
                    {{ toIDR(s.harga) }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">Estimasi Durasi</p>
                  <p class="font-bold text-blue-600">
                    {{ formatWaktu(s.durasi_pengerjaan) }}
                  </p>
                </div>
              </div>

              <!-- CTA Button -->
              <button
                class="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                Pesan Sekarang
                <i
                  class="mdi mdi-calendar-check text-xl group-hover:translate-x-1 transition-transform"
                ></i>
              </button>
            </div>

            <div
              class="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-2xl transition-all duration-300 pointer-events-none"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-gray-50 py-12 md:py-20 px-4 md:px-8 lg:px-20">
      <div class="mx-auto max-w-7xl">
        <h2
          class="mb-4 text-center text-2xl md:text-4xl font-bold text-gray-800"
        >
          Apa Kata Mereka?
        </h2>
        <p class="mb-12 text-center text-gray-600 max-w-2xl mx-auto">
          Kepuasan customer adalah prioritas utama kami
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div
            v-for="(testimonial, i) in TESTIMONIALS"
            :key="i"
            class="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center gap-1 mb-4">
              <span
                v-for="j in testimonial.rating"
                :key="j"
                class="text-yellow-400 text-xl"
                >★</span
              >
            </div>
            <p class="text-gray-600 italic mb-6 leading-relaxed">
              "{{ testimonial.text }}"
            </p>
            <div class="flex items-center gap-3 border-t pt-4">
              <div class="text-gray-500">
                <i :class="['mdi', testimonial.icon, 'text-5xl']"></i>
              </div>
              <div>
                <div class="font-bold text-gray-800">
                  {{ testimonial.name }}
                </div>
                <div class="text-sm text-gray-500">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="bg-white py-12 md:py-20 px-4 md:px-8 lg:px-20">
      <div class="mx-auto max-w-4xl">
        <h2
          class="mb-4 text-center text-2xl md:text-4xl font-bold text-gray-800"
        >
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

    <!-- About Us / Racing Heritage Section -->
    <section
      id="about-us-section"
      class="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 md:py-24 px-4 md:px-8 lg:px-20"
    >
      <div class="mx-auto max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left: gambar -->
          <div class="relative group">
            <div
              class="absolute inset-0 bg-red-600/20 rounded-3xl blur-2xl group-hover:bg-red-600/30 transition-all duration-500"
            ></div>
            <div class="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="@/assets/achievement.jpg"
                alt="KRGarage Racing Achievement"
                class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <!-- Right: Story & Achievements -->
          <div class="text-white">
            <h2 class="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Dari Garasi Rumah Menuju
              <span class="text-red-500">Juara Sirkuit</span>
            </h2>

            <p class="text-gray-300 text-lg leading-relaxed mb-8">
              KRGarage lahir dari kecintaan mendalam terhadap deru mesin Vespa
              2-tak. Berawal dari garasi rumah tahun 2016, kami tumbuh menjadi
              bengkel terpercaya dengan reputasi yang dibangun dari mulut ke
              mulut berdasarkan kepercayaan dan hasil nyata
            </p>

            <div
              class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
            >
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <i class="mdi mdi-flag-checkered text-red-500 text-2xl"></i>
                Keahlian Teruji di Sirkuit
              </h3>
              <p class="text-gray-300 mb-6">
                Bagi kami, performa bukan hanya teori. Keahlian yang kami asah
                di panasnya lintasan balap bersama KRTeam Garage kami terapkan
                langsung pada Vespa Anda. Kami membawa DNA juara ke dalam setiap
                servis harian.
              </p>

              <!-- Achievement List -->
              <div class="space-y-3">
                <div
                  v-for="achievement in ACHIEVEMENTS"
                  :key="`${achievement.rank}-${achievement.year}`"
                  class="flex items-center gap-3"
                >
                  <div
                    :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-lg',
                      achievement.rank === '1st'
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                        : 'bg-gradient-to-br from-orange-400 to-orange-600',
                    ]"
                  >
                    {{ achievement.rank }}
                  </div>
                  <div>
                    <div class="font-bold text-white">
                      {{ achievement.title }}
                    </div>
                    <div class="text-sm text-gray-400">
                      {{ achievement.year }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href="https://maps.app.goo.gl/HtWgfMzQ9tzz55Pw6"
                target="_blank"
                rel="noopener noreferrer"
                class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border-2 border-white/20 hover:border-white/40 flex items-center justify-center gap-2"
              >
                <i class="mdi mdi-map-marker"></i>
                Kunjungi Bengkel Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

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
