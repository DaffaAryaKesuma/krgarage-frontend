<script setup lang="ts">
import {
  useAdminLayananFormModal,
  type LayananFormData,
} from "@/components/admin/layanan/AdminLayananFormModal/useAdminLayananFormModal";
import { getFormInputClass } from "@/utils/formVariants";
import { getButtonClass } from "@/utils/buttonVariants";

const inputClass = getFormInputClass();

const props = defineProps<{
  show: boolean;
  mode: "add" | "edit";
  form: LayananFormData;
  previewImage: string | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
  "update:form": [value: LayananFormData];
  "update:previewImage": [value: string | null];
  fileChange: [file: File];
}>();

const { formTitle, handleFileChange, FILE_INPUT_ID } =
  useAdminLayananFormModal(props, emit);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
  >
    <div
      class="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
    >
      <!-- Modal Header -->
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

      <!-- Modal Form -->
      <form @submit.prevent="emit('submit')" class="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
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
                accept="image/*"
                @change="handleFileChange"
                class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
              <p class="text-xs text-gray-500 mt-1">
                Format: JPG, PNG (Maks. 2MB)
              </p>
            </div>
          </div>
        </div>

        <!-- Nama Layanan -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nama Layanan *
          </label>
          <input
            :value="form.nama_layanan"
            @input="
              emit('update:form', {
                ...form,
                nama_layanan: ($event.target as HTMLInputElement).value,
              })
            "
            type="text"
            required
            :class="inputClass"
          />
        </div>

        <!-- Deskripsi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi *
          </label>
          <textarea
            :value="form.deskripsi"
            @input="
              emit('update:form', {
                ...form,
                deskripsi: ($event.target as HTMLInputElement).value,
              })
            "
            required
            rows="3"
            :class="inputClass"
          ></textarea>
        </div>

        <!-- Harga -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Estimasi Harga (Rp) *
          </label>
          <input
            :value="form.harga"
            @input="
              emit('update:form', {
                ...form,
                harga: Number(($event.target as HTMLInputElement).value),
              })
            "
            type="number"
            required
            :class="inputClass"
          />
        </div>

        <!-- Waktu -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
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
              })
            "
            type="number"
            min="5"
            :class="inputClass"
            placeholder="60"
          />
          <p class="text-xs text-gray-500 mt-1">
            Contoh: 30 (30 menit), 90 (1.5 jam), 120 (2 jam)
          </p>
        </div>

        <!-- Buttons -->
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
