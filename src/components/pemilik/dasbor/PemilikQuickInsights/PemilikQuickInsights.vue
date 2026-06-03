<script setup lang="ts">
import { usePemilikQuickInsights } from "@/components/pemilik/dasbor/PemilikQuickInsights/usePemilikQuickInsights";

const props = defineProps<{ ringkasan: any; statistik: any }>();

const { INSIGHT_KARTU } = usePemilikQuickInsights(props);

const CARD_TONE_CLASS = {
  neutral: {
    card: "from-slate-600 to-slate-700 shadow-slate-200/70",
    title: "text-white/90",
    value: "text-white",
    subtitle: "text-white/80",
    icon: "bg-white/20 text-white",
  },
  success: {
    card: "from-green-500 to-green-600 shadow-green-100/70",
    title: "text-white/90",
    value: "text-white",
    subtitle: "text-white/80",
    icon: "bg-white/20 text-white",
  },
  info: {
    card: "from-blue-500 to-blue-600 shadow-blue-100/70",
    title: "text-white/90",
    value: "text-white",
    subtitle: "text-white/80",
    icon: "bg-white/20 text-white",
  },
  warning: {
    card: "from-amber-500 to-orange-500 shadow-amber-100/70",
    title: "text-white/90",
    value: "text-white",
    subtitle: "text-white/80",
    icon: "bg-white/20 text-white",
  },
  primary: {
    card: "from-red-500 to-red-600 shadow-red-100/70",
    title: "text-white/90",
    value: "text-white",
    subtitle: "text-white/80",
    icon: "bg-white/20 text-white",
  },
} as const;

type CardTone = keyof typeof CARD_TONE_CLASS;

const getCardToneClass = (tone: string) =>
  CARD_TONE_CLASS[tone as CardTone] ?? CARD_TONE_CLASS.neutral;
</script>

<template>
  <div class="mb-4 sm:mb-6">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 h-full">
      <div
        v-for="card in INSIGHT_KARTU"
        :key="card.title"
        :class="[
          'rounded-xl bg-gradient-to-br p-3 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:rounded-2xl sm:p-4',
          getCardToneClass(card.tone).card,
        ]"
      >
        <div class="flex min-h-20 items-start justify-between gap-2 sm:min-h-0">
          <div class="min-w-0">
            <p
              :class="[
                'mb-1 text-[11px] font-medium leading-tight sm:text-xs',
                getCardToneClass(card.tone).title,
              ]"
            >
              {{ card.title }}
            </p>
            <h3
              :class="[
                'break-words text-sm font-bold capitalize leading-tight sm:text-lg',
                getCardToneClass(card.tone).value,
              ]"
            >
              {{ card.value }}
            </h3>
            <p
              :class="[
                'mt-1 line-clamp-2 text-[10px] leading-snug sm:text-xs',
                getCardToneClass(card.tone).subtitle,
              ]"
            >
              {{ card.subtitle }}
            </p>
          </div>
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9',
              getCardToneClass(card.tone).icon,
            ]"
          >
            <i :class="['mdi', card.icon, 'text-lg sm:text-xl']"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
