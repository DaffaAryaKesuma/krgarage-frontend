<script setup lang="ts">
type WhyChooseUsItem = {
  icon: string;
  title: string;
  desc: string;
};

const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    icon: "mdi-trophy",
    title: "Pengalaman Terbukti",
    desc: "10+ tahun pengalaman dengan prestasi juara di berbagai kompetisi balap Vespa regional",
  },
  {
    icon: "mdi-wrench",
    title: "Mekanik Ahli",
    desc: "Tim mekanik spesialisasi mesin Vespa 2-tak",
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
</script>

<template>
  <!-- Why Choose Us Section -->
  <section class="bg-gray-50 py-12 md:py-20 px-4 md:px-8 lg:px-20">
    <div class="mx-auto max-w-7xl">
      <h2 class="mb-4 text-center text-2xl md:text-4xl font-bold text-gray-800">
        Mengapa Memilih KRGarage?
      </h2>
      <p class="mb-12 text-center text-gray-600 max-w-2xl mx-auto">
        Kami tidak hanya servis Vespa, tapi merawat passion Anda dengan dedikasi
        penuh
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
          <h3 class="text-xl font-bold text-gray-800 mb-3">{{ item.title }}</h3>
          <p class="text-gray-600">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
