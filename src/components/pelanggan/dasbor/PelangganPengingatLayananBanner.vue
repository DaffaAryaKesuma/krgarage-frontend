<script setup lang="ts">
// Format tanggal servis terakhir.
import { formatDateShort } from "@/utils/date";
// Helper class alert/chip.
import {
  getAlertBoxClass,
  getAlertIconClass,
  getChipBadgeClass,
} from "@/utils/badgeVariants";
// Format plat nomor uppercase.
import { formatPlatNomor } from "@/utils/format";

// Bentuk data Vespa yang perlu servis berkala.
interface VespaDueLayanan {
  id: number;
  model: string;
  plat_nomor: string;
  tanggal_servis_terakhir?: string;
}

// Props daftar Vespa yang sudah waktunya servis.
interface Props {
  vespas: VespaDueLayanan[];
}

defineProps<Props>();
</script>

<template>
  <!-- Banner hanya tampil jika ada Vespa yang perlu servis. -->
  <section
    v-if="vespas.length > 0"
    :class="[getAlertBoxClass('warning'), 'border-l-4 p-4 sm:p-6']"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <i
          :class="[getAlertIconClass('warning'), 'mdi mdi-alert-circle text-2xl sm:text-3xl']"
        ></i>
      </div>
      <div class="ml-3 sm:ml-4 flex-1">
        <h3
          class="mb-2 flex items-center text-base font-bold sm:text-lg"
        >
          <i class="mdi mdi-bell-alert text-xl mr-2"></i>
          Pengingat Servis Berkala
        </h3>
        <p class="mb-3 text-sm sm:text-base">
          Vespa Anda sudah waktunya untuk servis berkala:
        </p>
        <div class="space-y-2">
          <!-- List Vespa yang perlu servis. -->
          <div
            v-for="vespa in vespas"
            :key="vespa.id"
            :class="[getChipBadgeClass('warning'), 'block rounded p-3']"
          >
            <p class="font-semibold text-gray-800">
              {{ vespa.model }} - {{ formatPlatNomor(vespa.plat_nomor) }}
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
        <!-- CTA langsung ke halaman pemesanan. -->
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
