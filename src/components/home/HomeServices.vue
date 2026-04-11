<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { toIDR } from "@/utils/money";
import { formatWaktu, getImageUrl } from "@/utils/format";
import { API_URL } from "@/utils/api";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";

type Service = {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number | null;
  gambar: string;
};

const emit = defineEmits<{
  (e: "order"): void;
}>();

const toast = useToast();
const services = ref<Service[]>([]);
const isLoading = ref(true);

const fetchServices = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/layanan`);
    services.value = (response.data || []).map((s: any) => ({
      ...s,
      gambar: getImageUrl(s.gambar, API_URL),
    }));
  } catch (error: any) {
    logError(error, "fetchServices");
    toast.error(handleApiError(error));
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchServices);
</script>

<template>
  <!-- Services Section -->
  <section
    id="layanan"
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
          Dari perawatan rutin hingga modifikasi performa, kami siap memberikan
          yang terbaik untuk Vespa kesayangan Anda
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
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="s in services"
          :key="s.id"
          @click="emit('order')"
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
            <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
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
</template>
