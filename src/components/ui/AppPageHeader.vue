<script setup lang="ts">
interface Props {
  title: string;
  icon: string;
  subtitle?: string;
  subtitleClass?: string;
  containerClass?: string;
}

withDefaults(defineProps<Props>(), {
  subtitle: "",
  subtitleClass: "text-sm sm:text-base text-red-100",
  containerClass: "",
});
</script>

<template>
  <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
    <div
      :class="[
        'mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8',
        containerClass,
      ]"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3 sm:gap-4">
          <div
            class="h-12 w-12 shrink-0 rounded-full bg-white/20 backdrop-blur-sm sm:h-16 sm:w-16"
          >
            <div class="flex h-full w-full items-center justify-center">
              <i :class="['mdi text-2xl sm:text-4xl', icon]"></i>
            </div>
          </div>

          <div class="min-w-0">
            <h1 class="mb-1 text-2xl font-bold sm:text-3xl">{{ title }}</h1>

            <slot name="subtitle">
              <p v-if="subtitle" :class="subtitleClass">
                {{ subtitle }}
              </p>
            </slot>
          </div>
        </div>

        <div v-if="$slots.actions" class="shrink-0">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>
