<script setup lang="ts">
// Logic dan type form layanan.
import {
  useAdminLayananFormModal,
  type LayananFormData,
} from "@/components/admin/layanan/AdminLayananFormModal/useAdminLayananFormModal";
// Helper class form.
import {
  FORM_HINT_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_REQUIRED_MARK_CLASS,
} from "@/utils/formVariants";
// Helper class tombol.
import { getButtonClass } from "@/utils/buttonVariants";

// Props modal layanan.
const props = defineProps<{
  show: boolean;
  mode: "add" | "edit";
  form: LayananFormData;
  previewImage: string | null;
}>();

// Event v-model form, preview gambar, dan file change.
const emit = defineEmits<{
  close: [];
  submit: [];
  "update:form": [value: LayananFormData];
  "update:previewImage": [value: string | null];
  fileChange: [file: File];
}>();

// Ambil title modal dan handler file dari composable.
const {
  formTitle,
  handleFileChange,
  FILE_INPUT_ID,
  errors,
  touched,
  handleBlur,
  handleInput,
  getInputClass,
  getTextareaClass,
  handleSubmit,
} = useAdminLayananFormModal(props, emit);
</script>

<template>
  <!-- Overlay modal form layanan. -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
  >
    <!-- Card modal. -->
    <div
      class="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
    >
      <!-- Header modal. -->
      <div
        class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0"
      >
        <h2 class="text-xl font-bold text-gray-800">{{ formTitle }}</h2>
        <button
          @click="emit('close')"
          type="button"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="mdi mdi-close text-2xl"></i>
        </button>
      </div>

      <!-- Form layanan. -->
      <form
        @submit.prevent="handleSubmit"
        novalidate
        class="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar"
      >
        <!-- Upload gambar layanan. -->
        <div>
          <label :class="FORM_LABEL_CLASS">
            Foto Layanan
          </label>
          <div class="flex items-center gap-4">
            <div
              class="w-24 h-24 rounded-lg border border-gray-300 overflow-hidden bg-gray-100 flex-shrink-0"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400 text-xs"
              >
                Tanpa Gambar
              </div>
            </div>
            <div class="flex-grow">
              <input
                :id="FILE_INPUT_ID"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                @change="handleFileChange"
                class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
              <p :class="FORM_HINT_CLASS">
                Format: JPG, PNG (Maks. 2MB)
              </p>
              <p v-if="errors.gambar" :class="FORM_ERROR_CLASS">
                <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.gambar }}
              </p>
            </div>
          </div>
        </div>

        <!-- Nama layanan. -->
        <div>
          <label :class="FORM_LABEL_CLASS">
            Nama Layanan <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
          </label>
          <input
            :value="form.nama_layanan"
            @input="
              emit('update:form', {
                ...form,
                nama_layanan: ($event.target as HTMLInputElement).value,
              });
              handleInput('nama_layanan');
            "
            @blur="handleBlur('nama_layanan')"
            type="text"
            :class="getInputClass('nama_layanan')"
          />
          <p
            v-if="touched.nama_layanan && errors.nama_layanan"
            :class="FORM_ERROR_CLASS"
          >
            <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.nama_layanan }}
          </p>
        </div>

        <!-- Deskripsi layanan. -->
        <div>
          <label :class="FORM_LABEL_CLASS">
            Deskripsi <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
          </label>
          <textarea
            :value="form.deskripsi"
            @input="
              emit('update:form', {
                ...form,
                deskripsi: ($event.target as HTMLInputElement).value,
              });
              handleInput('deskripsi');
            "
            @blur="handleBlur('deskripsi')"
            rows="3"
            :class="getTextareaClass()"
          ></textarea>
          <p v-if="touched.deskripsi && errors.deskripsi" :class="FORM_ERROR_CLASS">
            <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.deskripsi }}
          </p>
        </div>

        <!-- Estimasi harga layanan. -->
        <div>
          <label :class="FORM_LABEL_CLASS">
            Estimasi Harga (Rp) <span :class="FORM_REQUIRED_MARK_CLASS">*</span>
          </label>
          <input
            :value="form.harga"
            @input="
              emit('update:form', {
                ...form,
                harga: ($event.target as HTMLInputElement).value === ''
                  ? Number.NaN
                  : Number(($event.target as HTMLInputElement).value),
              });
              handleInput('harga');
            "
            @blur="handleBlur('harga')"
            type="number"
            min="0"
            :class="getInputClass('harga')"
          />
          <p v-if="touched.harga && errors.harga" :class="FORM_ERROR_CLASS">
            <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.harga }}
          </p>
        </div>

        <!-- Estimasi durasi layanan dalam menit. -->
        <div>
          <label :class="FORM_LABEL_CLASS">
            Estimasi Waktu (menit)
          </label>
          <input
            :value="form.durasi_pengerjaan ?? ''"
            @input="
              emit('update:form', {
                ...form,
                durasi_pengerjaan: ($event.target as HTMLInputElement).value
                  ? Number(($event.target as HTMLInputElement).value)
                  : null,
              });
              handleInput('durasi_pengerjaan');
            "
            @blur="handleBlur('durasi_pengerjaan')"
            type="number"
            min="5"
            :class="getInputClass('durasi_pengerjaan')"
            placeholder="60"
          />
          <p
            v-if="touched.durasi_pengerjaan && errors.durasi_pengerjaan"
            :class="FORM_ERROR_CLASS"
          >
            <i class="mdi mdi-alert-circle text-xs"></i>
            {{ errors.durasi_pengerjaan }}
          </p>
          <p :class="FORM_HINT_CLASS">
            Contoh: 30 (30 menit), 90 (1.5 jam), 120 (2 jam)
          </p>
        </div>

        <!-- Tombol batal dan simpan. -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="emit('close')"
            :class="getButtonClass('secondary', 'md', 'flex-1')"
          >
            Batal
          </button>
          <button
            type="submit"
            :class="getButtonClass('primary', 'md', 'flex-1')"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
