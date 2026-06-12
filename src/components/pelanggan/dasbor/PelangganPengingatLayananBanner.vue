<script setup lang="ts">
import { computed, ref } from "vue";
// Mengunci scroll halaman saat modal detail terbuka.
import { scrollLock } from "@/composables/scrollLock";
// Format tanggal servis terakhir.
import { formatDateShort } from "@/utils/date";
import {
  getChipBadgeClass,
  getIconToneClass,
  getTonePanelClass,
} from "@/utils/badgeVariants";
import {
  getButtonClass,
  getFullWidthButtonClass,
  getIconButtonClass,
} from "@/utils/buttonVariants";
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

const props = defineProps<Props>();

// Modal detail daftar Vespa yang perlu servis.
const showDetailModal = ref(false);
scrollLock(() => showDetailModal.value);

const jumlahVespa = computed(() => props.vespas.length);
const firstVespa = computed(() => props.vespas[0]);
const hasSingleVespa = computed(() => jumlahVespa.value === 1);
const hasMultipleVespa = computed(() => jumlahVespa.value > 1);

const openDetailModal = () => {
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
};
</script>

<template>
  <!-- Card pengingat hanya tampil jika ada Vespa yang perlu servis. -->
  <section
    v-if="jumlahVespa > 0"
    :class="[getTonePanelClass('warning'), 'shadow-sm']"
  >
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex min-w-0 items-start gap-3">
        <div
          :class="[
            getIconToneClass('warning'),
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
          ]"
        >
          <i class="mdi mdi-bell-ring text-xl"></i>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h3
              class="text-sm font-bold leading-snug text-gray-900 sm:text-base"
            >
              Saatnya Servis Berkala
            </h3>
            <span :class="getChipBadgeClass('warning')">
              {{ jumlahVespa }} Vespa
            </span>
          </div>

          <p class="mt-1 font-medium text-sm leading-relaxed text-gray-700">
            <template v-if="hasSingleVespa && firstVespa">
              Vespa {{ firstVespa.model }} perlu servis ulang
            </template>
            <template v-else>
              Beberapa Vespa perlu dijadwalkan servis ulang
            </template>
          </p>

          <div
            v-if="hasSingleVespa && firstVespa"
            class="mt-3 flex flex-wrap items-center gap-2"
          >
            <span :class="getChipBadgeClass('primary')">
              {{ formatPlatNomor(firstVespa.plat_nomor) }}
            </span>
            <span class="text-xs text-gray-600">
              Servis terakhir:
              <span class="font-semibold text-gray-800">
                {{
                  firstVespa.tanggal_servis_terakhir
                    ? formatDateShort(firstVespa.tanggal_servis_terakhir)
                    : "Belum pernah"
                }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div class="flex w-full gap-2 lg:w-auto">
        <button
          v-if="hasMultipleVespa"
          type="button"
          :class="
            getButtonClass('warningOutline', 'sm', 'h-10 flex-1 lg:flex-none')
          "
          @click="openDetailModal"
        >
          Lihat Detail
        </button>

        <router-link
          v-if="hasSingleVespa"
          to="/app/pemesanan"
          :class="getButtonClass('primary', 'sm', 'h-10 flex-1 lg:flex-none')"
        >
          Servis Sekarang
        </router-link>
      </div>
    </div>
  </section>

  <!-- Modal detail daftar Vespa yang perlu servis. -->
  <Teleport to="body">
    <div
      v-if="showDetailModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      @click.self="closeDetailModal"
    >
      <div
        class="max-h-[88vh] w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl sm:max-w-lg"
      >
        <div
          class="flex items-start justify-between gap-4 border-b border-gray-100 p-4 sm:p-5"
        >
          <div class="flex min-w-0 items-start gap-3">
            <div
              :class="[
                getIconToneClass('primary'),
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              ]"
            >
              <i class="mdi mdi-motorbike text-xl"></i>
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-gray-900">
                Vespa Perlu Servis
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ jumlahVespa }} Vespa sudah masuk jadwal servis berkala
              </p>
            </div>
          </div>

          <button
            type="button"
            :class="
              getIconButtonClass('neutral', 'md', 'shrink-0 rounded-full')
            "
            aria-label="Tutup modal"
            @click="closeDetailModal"
          >
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="max-h-[58vh] space-y-3 overflow-y-auto p-4 sm:p-5">
          <div
            v-for="vespa in vespas"
            :key="vespa.id"
            class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-bold text-gray-900">
                  {{ vespa.model }}
                </p>
                <span :class="[getChipBadgeClass('primary'), 'mt-2']">
                  {{ formatPlatNomor(vespa.plat_nomor) }}
                </span>
              </div>

              <div
                :class="[
                  getIconToneClass('primary'),
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                ]"
              >
                <i class="mdi mdi-motorbike text-lg"></i>
              </div>
            </div>

            <div class="mt-3 rounded-lg bg-gray-50 px-3 py-2">
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Servis Terakhir
              </p>
              <p class="mt-1 text-sm font-semibold text-gray-900">
                {{
                  vespa.tanggal_servis_terakhir
                    ? formatDateShort(vespa.tanggal_servis_terakhir)
                    : "Belum pernah"
                }}
              </p>
            </div>

            <router-link
              to="/app/pemesanan"
              :class="getFullWidthButtonClass('primary', 'sm', 'mt-3 h-10')"
              @click="closeDetailModal"
            >
              <i class="mdi mdi-calendar-plus text-base"></i>
              Servis Sekarang
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
