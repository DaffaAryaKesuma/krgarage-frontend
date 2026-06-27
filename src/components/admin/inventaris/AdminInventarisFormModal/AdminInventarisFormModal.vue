<script setup lang="ts">
// Select kategori.
import CustomSelect from "@/components/ui/CustomSelect.vue";
// Class, type props/event, dan helper form berasal dari composable.
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  formKartuClass,
  errorClass,
  inputClass,
  labelClass,
  requiredMarkClass,
  textareaClass,
  useAdminInventarisFormModal,
  type AdminInventarisFormModalEmit,
  type AdminInventarisFormModalProps,
} from "./useAdminInventarisFormModal";

const props = defineProps<AdminInventarisFormModalProps>();
const emit = defineEmits<AdminInventarisFormModalEmit>();

// Generic field updater — replaces repetitive @input inline handlers
const {
  updateField,
  updateRequiredField,
  toNum,
  toStr,
  errors,
  touched,
  handleBlur,
  getInputClass,
  handleSubmit,
} = useAdminInventarisFormModal(props, emit);
</script>

<template>
  <!-- Overlay modal tambah/edit suku cadang. -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <!-- Card modal. -->
    <div
      class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <!-- Header berubah antara tambah dan edit. -->
      <div class="border-b border-slate-200 px-6 py-5">
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"
          >
            <i
              class="mdi text-xl"
              :class="
                selectedSukuCadang
                  ? 'mdi-pencil-outline'
                  : 'mdi-package-variant-closed'
              "
            ></i>
          </div>
          <h2 class="text-xl font-bold">
            {{ selectedSukuCadang ? "Edit Suku Cadang" : "Tambah Suku Cadang" }}
          </h2>
        </div>
      </div>

      <!-- Form tambah/edit suku cadang. -->
      <form
        @submit.prevent="handleSubmit"
        novalidate
        class="max-h-[calc(90vh-5.5rem)] space-y-4 overflow-y-auto p-6 custom-scrollbar"
      >
        <!-- Nama suku cadang. -->
        <div :class="formKartuClass">
          <label :class="labelClass">
            Nama Suku Cadang <span :class="requiredMarkClass">*</span>
          </label>
          <input
            :value="form.nama_suku_cadang"
            @input="
              updateRequiredField('nama_suku_cadang', toStr($event));
            "
            @blur="handleBlur('nama_suku_cadang')"
            type="text"
            placeholder="Contoh: Aki 6V 4Ah"
            :class="getInputClass('nama_suku_cadang')"
          />
          <p v-if="touched.nama_suku_cadang && errors.nama_suku_cadang" :class="errorClass">
            <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.nama_suku_cadang }}
          </p>
        </div>

        <!-- Kategori dan stok awal. -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div :class="formKartuClass">
            <label :class="labelClass">
              Kategori <span :class="requiredMarkClass">*</span>
            </label>
            <CustomSelect
              :model-value="form.id_kategori"
              @update:model-value="
                updateRequiredField('id_kategori', Number($event) || null)
                ; touched.id_kategori = true
              "
              :options="kategoriOptions"
              placeholder="Pilih kategori"
            />
            <p v-if="touched.id_kategori && errors.id_kategori" :class="errorClass">
              <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.id_kategori }}
            </p>
            <!-- Input kategori baru. -->
            <div class="mt-3 flex gap-2">
              <input
                :value="categoryName"
                @input="emit('update:categoryName', toStr($event))"
                type="text"
                placeholder="Kategori baru"
                :class="inputClass"
              />
              <button
                type="button"
                @click="emit('create-category')"
                :disabled="categoryLoading"
                class="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ categoryLoading ? "Menyimpan..." : "Tambah" }}
              </button>
            </div>
          </div>

          <div :class="formKartuClass">
            <label :class="labelClass">
              Stok Awal <span :class="requiredMarkClass">*</span>
            </label>
            <input
              :value="form.jumlah_stok"
              @input="updateRequiredField('jumlah_stok', toNum($event))"
              @blur="handleBlur('jumlah_stok')"
              type="number"
              min="0"
              placeholder="0"
              :class="getInputClass('jumlah_stok')"
            />
            <p v-if="touched.jumlah_stok && errors.jumlah_stok" :class="errorClass">
              <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.jumlah_stok }}
            </p>
          </div>
        </div>

        <!-- Harga beli dan harga jual. -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div :class="formKartuClass">
            <label :class="labelClass">
              Harga Beli <span :class="requiredMarkClass">*</span>
            </label>
            <input
              :value="form.harga_beli"
              @input="updateRequiredField('harga_beli', toNum($event))"
              @blur="handleBlur('harga_beli')"
              type="number"
              step="1"
              inputmode="numeric"
              min="0"
              placeholder="120000"
              :class="getInputClass('harga_beli')"
            />
            <p v-if="touched.harga_beli && errors.harga_beli" :class="errorClass">
              <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.harga_beli }}
            </p>
          </div>

          <div :class="formKartuClass">
            <label :class="labelClass">
              Harga Jual <span :class="requiredMarkClass">*</span>
            </label>
            <input
              :value="form.harga_jual"
              @input="updateRequiredField('harga_jual', toNum($event))"
              @blur="handleBlur('harga_jual')"
              type="number"
              step="1"
              inputmode="numeric"
              min="0"
              placeholder="175000"
              :class="getInputClass('harga_jual')"
            />
            <p v-if="touched.harga_jual && errors.harga_jual" :class="errorClass">
              <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.harga_jual }}
            </p>
          </div>
        </div>

        <!-- Batas minimal stok untuk peringatan stok menipis. -->
        <div :class="formKartuClass">
          <label :class="labelClass">
            Batas Minimal Stok <span :class="requiredMarkClass">*</span>
          </label>
          <input
            :value="form.batas_minimal_stok"
            @input="
              updateRequiredField(
                'batas_minimal_stok',
                toStr($event) === '' ? null : toNum($event),
              )
            "
            @blur="handleBlur('batas_minimal_stok')"
            type="number"
            min="0"
            placeholder="Contoh: 5"
            :class="getInputClass('batas_minimal_stok')"
          />
          <p v-if="touched.batas_minimal_stok && errors.batas_minimal_stok" :class="errorClass">
            <i class="mdi mdi-alert-circle text-xs"></i>{{ errors.batas_minimal_stok }}
          </p>
          <p class="mt-1.5 text-xs text-gray-500">
            Peringatan akan muncul jika stok mencapai nilai ini
          </p>
        </div>

        <!-- Deskripsi opsional. -->
        <div :class="formKartuClass">
          <label :class="labelClass">Deskripsi</label>
          <textarea
            :value="form.deskripsi"
            @input="updateField('deskripsi', toStr($event))"
            rows="3"
            placeholder="Tulis informasi tambahan jika perlu"
            :class="textareaClass"
          ></textarea>
        </div>

        <!-- Footer tombol batal dan simpan. -->
        <div
          class="grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            @click="emit('close')"
            :class="buttonSecondaryClass"
          >
            Batal
          </button>
          <button type="submit" :class="buttonPrimaryClass" :disabled="loading">
            <i v-if="loading" class="mdi mdi-loading mdi-spin mr-2"></i>
            {{ loading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
