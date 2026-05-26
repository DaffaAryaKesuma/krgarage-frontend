<script setup lang="ts">
import { toRef } from "vue";
import {
  usePelangganVespaFormModal,
  type VespaFormInitialData,
  type VespaFormPayload,
} from "./usePelangganVespaFormModal";
import { scrollLock } from "@/composables/scrollLock";
import { getAlertBoxClass } from "@/utils/badgeVariants";
import { getButtonClass } from "@/utils/buttonVariants";
import {
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
  FORM_INPUT_ICON_WRAPPER_CLASS,
  FORM_INPUT_ICON_PREFIX_CLASS,
  FORM_ERROR_CLASS,
  getFormInputWithIconClass,
} from "@/utils/formVariants";

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

scrollLock(() => props.show);

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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      @click="emit('close')"
    ></div>

    <!-- Modal Content -->
    <section
      class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
    >
      <!-- Accent Line -->
      <div
        class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-red-600"
      ></div>

      <!-- Header -->
      <div
        class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white pt-6"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600"
          >
            <i
              class="mdi text-xl"
              :class="mode === 'add' ? 'mdi-plus-circle' : 'mdi-pencil'"
            ></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">
              {{ mode === "add" ? "Tambah Vespa Baru" : "Edit Data Vespa" }}
            </h2>
            <p class="text-xs text-gray-500 mt-0.5 font-medium">
              Lengkapi data kendaraan di bawah ini
            </p>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto flex-1 custom-scrollbar">
        <form @submit.prevent="onSubmit" id="vespa-form" class="p-6 space-y-5">
          <!-- Model Field -->
          <div>
            <label :class="FORM_LABEL_CLASS">
              Model Vespa <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
            </label>
            <div :class="FORM_INPUT_ICON_WRAPPER_CLASS">
              <div :class="FORM_INPUT_ICON_PREFIX_CLASS">
                <i class="mdi mdi-motorbike text-lg"></i>
              </div>
              <input
                v-model="form.model"
                type="text"
                @blur="
                  touched.model = true;
                  validateField('model');
                "
                @input="validateField('model')"
                :class="getFormInputWithIconClass(!!(errors.model && touched.model))"
                placeholder="Contoh: PX 150"
              />
            </div>
            <p
              v-if="errors.model && touched.model"
              :class="FORM_ERROR_CLASS"
            >
              <i class="mdi mdi-alert-circle text-xs mt-0.5"></i>
              {{ errors.model }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Tahun Field -->
            <div>
              <label :class="FORM_LABEL_CLASS">
                Tahun Produksi <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
              </label>
              <div :class="FORM_INPUT_ICON_WRAPPER_CLASS">
                <div :class="FORM_INPUT_ICON_PREFIX_CLASS">
                  <i class="mdi mdi-calendar-range text-lg"></i>
                </div>
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
                  :class="getFormInputWithIconClass(!!(errors.tahun_produksi && touched.tahun_produksi))"
                  placeholder="Contoh: 1980"
                />
              </div>
              <p
                v-if="errors.tahun_produksi && touched.tahun_produksi"
                :class="FORM_ERROR_CLASS"
              >
                <i class="mdi mdi-alert-circle text-xs mt-0.5"></i>
                {{ errors.tahun_produksi }}
              </p>
            </div>

            <!-- Plat Nomor Field -->
            <div>
              <label :class="FORM_LABEL_CLASS">
                Plat Nomor <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
              </label>
              <div :class="FORM_INPUT_ICON_WRAPPER_CLASS">
                <div :class="FORM_INPUT_ICON_PREFIX_CLASS">
                  <i class="mdi mdi-license text-lg"></i>
                </div>
                <input
                  v-model="form.plat_nomor"
                  type="text"
                  @blur="
                    touched.plat_nomor = true;
                    validateField('plat_nomor');
                  "
                  @input="validateField('plat_nomor')"
                  :class="getFormInputWithIconClass(!!(errors.plat_nomor && touched.plat_nomor), 'uppercase font-bold tracking-wider')"
                  placeholder="Contoh: BM 1234 ABC"
                />
              </div>
              <p
                v-if="errors.plat_nomor && touched.plat_nomor"
                :class="FORM_ERROR_CLASS"
              >
                <i class="mdi mdi-alert-circle text-xs mt-0.5"></i>
                {{ errors.plat_nomor }}
              </p>
            </div>
          </div>

          <!-- Error Global -->
          <div
            v-if="error"
            :class="[getAlertBoxClass('error'), 'mt-2 flex gap-3 p-3 shadow-none']"
          >
            <i class="mdi mdi-alert-outline text-lg shrink-0 mt-0.5"></i>
            <p class="text-sm font-medium">{{ error }}</p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 sm:justify-end mt-auto"
      >
        <button
          type="button"
          @click="emit('close')"
          :class="getButtonClass('secondary', 'md', 'flex-1 sm:flex-none px-5')"
        >
          Batal
        </button>
        <button
          form="vespa-form"
          type="submit"
          :class="getButtonClass('primary', 'md', 'flex-1 sm:flex-none px-6')"
        >
          {{ mode === "add" ? "Tambah Vespa" : "Simpan Perubahan" }}
        </button>
      </div>
    </section>
  </div>
</template>
