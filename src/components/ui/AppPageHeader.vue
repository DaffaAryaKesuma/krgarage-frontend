<script setup lang="ts">
// Header standar halaman agar title, icon, subtitle, dan tombol aksi konsisten.
interface Props {
  title: string;
  icon: string;
  subtitle?: string;
  subtitleClass?: string;
  titleClass?: string;
  containerClass?: string;
}

// Default class dipakai jika parent tidak mengirim override.
withDefaults(defineProps<Props>(), {
  subtitle: "",
  subtitleClass: "text-sm sm:text-base text-red-100",
  titleClass: "",
  containerClass: "",
});
</script>

<template>
  <!-- Band header merah di bagian atas halaman. -->
  <div class="bg-red-700 text-white shadow-lg">
    <!-- Container mengikuti lebar konten utama aplikasi. -->
    <div
      :class="[
        'mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8',
        containerClass,
      ]"
    >
      <!-- Layout kiri untuk judul, kanan untuk slot aksi. -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3 sm:gap-4">
          <!-- Lingkaran icon halaman. -->
          <div
            class="h-12 w-12 shrink-0 rounded-full bg-white/20 backdrop-blur-sm sm:h-16 sm:w-16"
          >
            <div class="flex h-full w-full items-center justify-center">
              <i :class="['mdi text-2xl sm:text-4xl', icon]"></i>
            </div>
          </div>

          <!-- Judul dan subtitle. -->
          <div class="min-w-0">
            <h1 :class="['mb-1 text-2xl font-bold sm:text-3xl', titleClass]">
              {{ title }}
            </h1>

            <!-- Parent bisa override subtitle lewat slot subtitle. -->
            <slot name="subtitle">
              <p v-if="subtitle" :class="subtitleClass">
                {{ subtitle }}
              </p>
            </slot>
          </div>
        </div>

        <!-- Slot aksi, misalnya tombol kembali. -->
        <div v-if="$slots.aksi" class="shrink-0">
          <slot name="aksi" />
        </div>
      </div>
    </div>
  </div>
</template>
