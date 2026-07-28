<script setup lang="ts">
// computed dipakai untuk menyusun kartu statistik dari props.
import { computed } from "vue";
// Helper format rupiah.
import { toIDR } from "@/utils/money";
// Helper class ikon berdasarkan tone warna.
import { getIconToneClass, type IconToneKey } from "@/utils/badgeVariants";

// Statistik cepat dari dashboard pemilik.
interface Statistik {
  pendapatanHariIni: number;
  pendapatanBulanIni: number;
  unitHariIni: number;
  nilaiStok: number;
  loading: boolean;
}

// Ringkasan finansial dari API laporan.
interface Ringkasan {
  finansial?: {
    pendapatan_kotor: number;
    pengeluaran: number;
    keuntungan_bersih: number;
  };
}

// Perbandingan performa harian dari API.
interface Performa {
  hari_ini?: { pendapatan: number; pengeluaran: number; keuntungan: number };
  kemarin?:  { pendapatan: number; pengeluaran: number; keuntungan: number };
}

// Props menerima statistik harian, ringkasan bulanan, dan performa harian.
interface Props {
  statistik: Statistik;
  ringkasan: Ringkasan | null;
  performa?: Performa | null;
}

const props = defineProps<Props>();

// Hitung selisih nominal Rupiah pendapatan hari ini dibanding kemarin.
const infoPendapatanHarian = computed(() => {
  const hariIni = props.performa?.hari_ini?.pendapatan ?? props.statistik.pendapatanHariIni;
  const kemarin = props.performa?.kemarin?.pendapatan ?? 0;
  const selisih = hariIni - kemarin;

  if (selisih === 0) {
    return { badge: "Rp 0 vs kemarin", naik: true, nol: true };
  }

  const naik = selisih > 0;
  const absVal = Math.abs(selisih);
  const formattedNominal = (naik ? "+Rp " : "-Rp ") + absVal.toLocaleString("id-ID");

  return {
    badge: `${formattedNominal} vs kemarin`,
    naik,
    nol: false,
  };
});

// Susun data kartu agar template cukup melakukan v-for.
const STAT_KARTU = computed(() => [
  {
    title: "Pendapatan Hari Ini",
    value: toIDR(props.statistik.pendapatanHariIni),
    icon: "mdi-cash-multiple",
    tone: "success" as IconToneKey,
    subBadge: infoPendapatanHarian.value,
  },
  {
    title: "Pendapatan Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.pendapatan_kotor || 0),
    icon: "mdi-chart-line",
    tone: "info" as IconToneKey,
  },
  {
    title: "Pengeluaran Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.pengeluaran || 0),
    icon: "mdi-cash-minus",
    tone: "danger" as IconToneKey,
  },
  {
    title: "Keuntungan Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.keuntungan_bersih || 0),
    icon: "mdi-wallet-plus",
    tone: "emerald" as IconToneKey,
  },
]);
</script>

<template>
  <!-- Grid kartu statistik finansial pemilik. -->
  <div class="mb-4 sm:mb-6">
    <div
      class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4"
    >
      <!-- Satu kartu menampilkan satu metrik finansial. -->
      <div
        v-for="card in STAT_KARTU"
        :key="card.title"
        class="relative overflow-hidden rounded-xl bg-white px-3 py-2.5 shadow-md transition-all hover:shadow-lg sm:rounded-2xl sm:p-6"
      >
        <div class="flex items-center justify-between gap-3 sm:min-h-0 sm:items-start">
          <div class="min-w-0 flex-1">
            <p class="text-[11px] font-medium leading-tight text-gray-600 sm:text-sm">
              {{ card.title }}
            </p>

            <h3
              class="mt-1 break-words text-base font-bold leading-tight text-gray-900 sm:mt-2 sm:text-xl"
            >
              {{ card.value }}
            </h3>

            <!-- Badge perbandingan nominal Rupiah harian (Tanpa persenan). -->
            <div v-if="card.subBadge" class="mt-2 flex items-center gap-1">
              <span
                :class="[
                  'inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-xs',
                  card.subBadge.nol
                    ? 'bg-gray-100 text-gray-600'
                    : card.subBadge.naik
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700',
                ]"
              >
                <i
                  :class="[
                    'mdi text-xs',
                    card.subBadge.nol ? 'mdi-minus' : card.subBadge.naik ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold',
                  ]"
                ></i>
                {{ card.subBadge.badge }}
              </span>
            </div>
          </div>

          <!-- Ikon kartu mengikuti tone tiap metrik. -->
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl',
              getIconToneClass(card.tone),
            ]"
          >
            <i
              :class="['mdi', card.icon, 'text-lg sm:text-2xl']"
              style="line-height: 1"
            ></i>
          </div>
        </div>

        <!-- Elemen dekoratif di pojok kartu. -->
        <div
          class="absolute -right-10 -bottom-10 h-20 w-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50 sm:-right-8 sm:-bottom-8 sm:h-32 sm:w-32"
        ></div>
      </div>
    </div>
  </div>
</template>
