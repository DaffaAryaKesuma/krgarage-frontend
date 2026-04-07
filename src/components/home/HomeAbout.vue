<script setup lang="ts">
type AchievementItem = {
  rank: string;
  title: string;
  year: string;
};

const ACHIEVEMENTS: AchievementItem[] = [
  { rank: "1st", title: "Juara 1 - Sumatera Cup Prix Bengkulu", year: "2024" },
  { rank: "3rd", title: "Podium 3 - Sumatera Cup Prix Bengkulu", year: "2024" },
  { rank: "3rd", title: "Podium 3 - A2 Drag Race & Drag Bike", year: "2023" },
  { rank: "3rd", title: "Podium 3 - Sumatera Cup Prix Siak", year: "2023" },
  { rank: "1st", title: "Juara 1 - Riau Cup Prix", year: "2023" },
  { rank: "3rd", title: "Podium 3 - The Brotos Seri 2", year: "2022" },
];
</script>

<template>
  <!-- About Us / Racing Heritage Section -->
  <section
    id="tentang-kami"
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
            bengkel terpercaya dengan reputasi yang dibangun dari mulut ke mulut
            berdasarkan kepercayaan dan hasil nyata
          </p>

          <div
            class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
          >
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
              <i class="mdi mdi-flag-checkered text-red-500 text-2xl"></i>
              Keahlian Teruji di Sirkuit
            </h3>
            <p class="text-gray-300 mb-6">
              Bagi kami, performa bukan hanya teori. Keahlian yang kami asah di
              panasnya lintasan balap bersama KRTeam Garage kami terapkan
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
</template>
