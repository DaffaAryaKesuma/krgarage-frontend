<script setup lang="ts">
import { toRef } from "vue";
import {
  usePelangganVespaFormModal,
  type VespaFormInitialData,
  type VespaFormPayload,
} from "@/composables/usePelangganVespaFormModal";

interface Props {
  show: boolean;
  mode: "add" | "edit";
  initialData?: VespaFormInitialData;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  mode: "add",
  error: "",
});

const emit = defineEmits<{
  submit: [data: VespaFormPayload];
  close: [];
}>();

const {
  form,
  errors,
  touched,
  maxProductionYear,
  validateField,
  handleSubmit,
} = usePelangganVespaFormModal(toRef(props, "initialData"));

const onSubmit = () => {
  const payload = handleSubmit();
  if (!payload) return;
  emit("submit", payload);
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <section
      class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <h2
        class="text-2xl font-bold text-gray-900 mb-6 p-6 border-b border-gray-100 sticky top-0 bg-white"
      >
        <i class="mdi mdi-pencil-box text-red-600 mr-2"></i>
        {{ mode === "add" ? "Tambah Vespa Baru" : "Edit Vespa" }}
      </h2>
      <form @submit.prevent="onSubmit" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Model Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="mdi mdi-car-side text-red-600 mr-1"></i>Model
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.model"
              type="text"
              @blur="
                touched.model = true;
                validateField('model');
              "
              @input="validateField('model')"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all focus:outline-none',
                errors.model && touched.model
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-2 focus:ring-red-200',
              ]"
              placeholder="Contoh: Vespa Sprint 150"
            />
            <p
              v-if="errors.model && touched.model"
              class="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle text-lg"></i>
              {{ errors.model }}
            </p>
          </div>

          <!-- Tahun Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="mdi mdi-calendar text-red-600 mr-1"></i>Tahun
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.tahun_produksi"
              type="number"
              @blur="
                touched.tahun_produksi = true;
                validateField('tahun_produksi');
              "
              @input="validateField('tahun_produksi')"
              :min="1946"
              :max="maxProductionYear"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all focus:outline-none',
                errors.tahun_produksi && touched.tahun_produksi
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-2 focus:ring-red-200',
              ]"
              placeholder="Contoh: 2020"
            />
            <p
              v-if="errors.tahun_produksi && touched.tahun_produksi"
              class="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle text-lg"></i>
              {{ errors.tahun_produksi }}
            </p>
          </div>

          <!-- Plat Nomor Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="mdi mdi-license text-red-600 mr-1"></i>Plat Nomor
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.plat_nomor"
              type="text"
              @blur="
                touched.plat_nomor = true;
                validateField('plat_nomor');
              "
              @input="validateField('plat_nomor')"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all focus:outline-none uppercase',
                errors.plat_nomor && touched.plat_nomor
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-2 focus:ring-red-200',
              ]"
              placeholder="Contoh: BM 1234 ABC"
            />
            <p
              v-if="errors.plat_nomor && touched.plat_nomor"
              class="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle text-lg"></i>
              {{ errors.plat_nomor }}
            </p>
          </div>
        </div>

        <p
          v-if="error"
          class="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2"
        >
          <i class="mdi mdi-alert text-lg"></i>
          {{ error }}
        </p>

        <div class="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <i class="mdi mdi-check-circle"></i>
            {{ mode === "add" ? "Tambah Vespa" : "Perbarui Vespa" }}
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
