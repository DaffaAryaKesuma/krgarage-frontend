<script setup lang="ts">
import { formatDateShort } from "@/utils/date";

interface VespaDueService {
  id: number;
  model: string;
  plat_nomor: string;
  tanggal_servis_terakhir?: string;
}

interface Props {
  vespas: VespaDueService[];
}

defineProps<Props>();
</script>

<template>
  <section
    v-if="vespas.length > 0"
    class="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-lg shadow"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <i
          class="mdi mdi-alert-circle text-2xl sm:text-3xl text-orange-500"
        ></i>
      </div>
      <div class="ml-3 sm:ml-4 flex-1">
        <h3
          class="text-base sm:text-lg font-bold text-orange-800 mb-2 flex items-center"
        >
          <i class="mdi mdi-bell-alert text-xl mr-2"></i>
          Pengingat Servis Berkala
        </h3>
        <p class="text-sm sm:text-base text-orange-700 mb-3">
          Vespa Anda sudah waktunya untuk servis berkala:
        </p>
        <div class="space-y-2">
          <div
            v-for="vespa in vespas"
            :key="vespa.id"
            class="bg-white p-3 rounded border border-orange-200"
          >
            <p class="font-semibold text-gray-800">
              {{ vespa.model }} - {{ vespa.plat_nomor }}
            </p>
            <p class="text-sm text-gray-600">
              Terakhir servis:
              {{
                vespa.tanggal_servis_terakhir
                  ? formatDateShort(vespa.tanggal_servis_terakhir)
                  : "Belum pernah"
              }}
            </p>
          </div>
        </div>
        <router-link
          to="/app/pemesanan"
          class="inline-block mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-orange-600 text-white text-sm sm:text-base rounded-lg hover:bg-orange-700 transition"
        >
          Pesan Servis Sekarang
        </router-link>
      </div>
    </div>
  </section>
</template>
