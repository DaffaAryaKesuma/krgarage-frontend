<script setup lang="ts">
import { getChipBadgeClass, getIconToneClass } from "@/utils/badgeVariants";
import {
  getSelectionCardClass,
  getSelectionCheckClass,
} from "@/utils/selectionVariants";
import { FORM_ERROR_CLASS } from "@/utils/formVariants";
import { formatPlatNomor } from "@/utils/format";
import type { VespaBasic } from "@/types/vespa";

interface Props {
  vespas: VespaBasic[];
  modelValue: number | null;
  error?: string;
  touched?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: number | null): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectVespa = (id: number) => {
  emit("update:modelValue", props.modelValue === id ? null : id);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-6">
      <div
        :class="[
          getIconToneClass('info'),
          'flex h-10 w-10 items-center justify-center rounded-full',
        ]"
      >
        <i class="mdi mdi-motorbike text-xl"></i>
      </div>
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900">Pilih Vespa</h2>
        <p class="text-sm text-gray-500">Vespa mana yang akan dilayanan?</p>
      </div>
    </div>

    <div
      v-if="vespas.length === 0"
      class="p-6 text-center"
    >
      <i class="mdi mdi-motorbike text-5xl text-blue-300 mb-3"></i>
      <p class="text-gray-600 font-semibold">Anda belum menambahkan Vespa</p>
      <router-link
        to="/app/vespa-saya"
        class="text-blue-600 hover:text-blue-800 font-semibold inline-block mt-2"
      >
        Tambah Vespa Sekarang
        <i class="mdi mdi-arrow-right text-lg"></i>
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="vespa in vespas"
        :key="vespa.id"
        @click="!vespa.pemesanan_aktif && selectVespa(vespa.id)"
        :class="getSelectionCardClass({
          selected: modelValue === vespa.id,
          disabled: vespa.pemesanan_aktif,
          tone: 'info',
          extraClass: 'p-5',
        })"
      >
        <div class="flex items-start gap-3">
          <div
            :class="[
              getIconToneClass('info'),
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
            ]"
          >
            <i :class="['mdi mdi-motorbike text-lg', vespa.pemesanan_aktif ? 'text-gray-500' : '']"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-sm text-gray-900">{{ vespa.model }}</h4>
            <p class="text-xs text-gray-600">
              {{ formatPlatNomor(vespa.plat_nomor) }}
            </p>
            <span
              v-if="vespa.pemesanan_aktif"
              :class="[getChipBadgeClass('neutral'), 'mt-1 gap-1 px-2 py-0.5 text-xs font-semibold']"
            >
              <i class="mdi mdi-clock-outline text-xs"></i>
              Sedang dalam servis
            </span>
          </div>
          <div
            v-if="modelValue === vespa.id && !vespa.pemesanan_aktif"
            :class="getSelectionCheckClass('info', true, 'flex-shrink-0')"
          >
            <i class="mdi mdi-check text-white text-sm"></i>
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="error && touched"
      :class="[FORM_ERROR_CLASS, 'mt-4']"
    >
      <i class="mdi mdi-alert-circle"></i>{{ error }}
    </p>
  </div>
</template>
