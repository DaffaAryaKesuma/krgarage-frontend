<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  formKartuClass,
  inputClass,
  useAdminInventarisFormModal,
  type AdminInventarisFormModalEmit,
  type AdminInventarisFormModalProps,
} from "./useAdminInventarisFormModal";

const props = defineProps<AdminInventarisFormModalProps>();
const emit = defineEmits<AdminInventarisFormModalEmit>();

// Generic field updater — replaces repetitive @input inline handlers
const { updateField, toNum, toStr } = useAdminInventarisFormModal(props, emit);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <!-- Header -->
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

      <!-- Form -->
      <form
        @submit.prevent="emit('submit')"
        class="max-h-[calc(90vh-5.5rem)] space-y-4 overflow-y-auto p-6 custom-scrollbar"
      >
        <!-- Nama Suku Cadang -->
        <div :class="formKartuClass">
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Nama Suku Cadang <span class="text-red-600">*</span>
          </label>
          <input
            :value="form.nama_suku_cadang"
            @input="updateField('nama_suku_cadang', toStr($event))"
            type="text"
            required
            placeholder="Contoh: Aki 6V 4Ah"
            :class="inputClass"
          />
        </div>

        <!-- Kategori + Stok Awal -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div :class="formKartuClass">
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Kategori <span class="text-red-600">*</span>
            </label>
            <CustomSelect
              :model-value="form.id_kategori"
              @update:model-value="
                updateField('id_kategori', Number($event) || null)
              "
              :options="kategoriOptions"
              placeholder="Pilih kategori"
            />
            <div class="mt-3 flex gap-2">
              <input
                :value="categoryName"
                @input="emit('update:categoryName', toStr($event))"
                type="text"
                placeholder="Kategori baru"
                class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
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
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Stok Awal <span class="text-red-600">*</span>
            </label>
            <input
              :value="form.jumlah_stok"
              @input="updateField('jumlah_stok', toNum($event))"
              type="number"
              min="0"
              required
              placeholder="0"
              :class="inputClass"
            />
          </div>
        </div>

        <!-- Harga Beli + Harga Jual -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div :class="formKartuClass">
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Harga Beli <span class="text-red-600">*</span>
            </label>
            <input
              :value="form.harga_beli"
              @input="updateField('harga_beli', toNum($event))"
              type="number"
              step="1"
              inputmode="numeric"
              min="0"
              required
              placeholder="120000"
              :class="inputClass"
            />
          </div>

          <div :class="formKartuClass">
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Harga Jual <span class="text-red-600">*</span>
            </label>
            <input
              :value="form.harga_jual"
              @input="updateField('harga_jual', toNum($event))"
              type="number"
              step="1"
              inputmode="numeric"
              min="0"
              required
              placeholder="175000"
              :class="inputClass"
            />
          </div>
        </div>

        <!-- Batas Minimal Stok -->
        <div :class="formKartuClass">
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            Batas Minimal Stok <span class="text-red-600">*</span>
          </label>
          <input
            :value="form.batas_minimal_stok"
            @input="
              updateField(
                'batas_minimal_stok',
                toStr($event) === '' ? null : toNum($event),
              )
            "
            type="number"
            min="0"
            required
            placeholder="Contoh: 5"
            :class="inputClass"
          />
          <p class="mt-2 text-xs text-slate-500">
            Peringatan akan muncul jika stok mencapai nilai ini
          </p>
        </div>

        <!-- Deskripsi -->
        <div :class="formKartuClass">
          <label class="mb-2 block text-sm font-semibold text-slate-700"
            >Deskripsi</label
          >
          <textarea
            :value="form.deskripsi"
            @input="updateField('deskripsi', toStr($event))"
            rows="3"
            placeholder="Tulis informasi tambahan jika perlu"
            :class="inputClass"
          ></textarea>
        </div>

        <!-- Footer -->
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
