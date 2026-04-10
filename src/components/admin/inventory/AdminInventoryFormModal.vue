<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";

interface Sparepart {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
  stok_menipis: boolean;
}

interface FormData {
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
}

interface Props {
  show: boolean;
  form: FormData;
  selectedSparepart: Sparepart | null;
  loading: boolean;
  kategoriOptions: Array<{ value: string; label: string }>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [];
  "update:form": [value: FormData];
}>();

const handleKategoriChange = (value: string | number | null) => {
  emit("update:form", { ...props.form, kategori: String(value || "") });
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="sticky top-0 bg-white border-b p-6">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ selectedSparepart ? "Edit Suku Cadang" : "Tambah Suku Cadang" }}
        </h2>
      </div>

      <form @submit.prevent="emit('submit')" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nama Suku Cadang <span class="text-red-600">*</span>
          </label>
          <input
            :value="form.nama_suku_cadang"
            @input="
              emit('update:form', {
                ...form,
                nama_suku_cadang: ($event.target as HTMLInputElement).value,
              })
            "
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span class="text-red-600">*</span>
            </label>
            <CustomSelect
              :model-value="form.kategori"
              @update:model-value="handleKategoriChange"
              :options="kategoriOptions"
              placeholder="Pilih kategori"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Stok Awal <span class="text-red-600">*</span>
            </label>
            <input
              :value="form.jumlah_stok"
              @input="
                emit('update:form', {
                  ...form,
                  jumlah_stok: Number(
                    ($event.target as HTMLInputElement).value,
                  ),
                })
              "
              type="number"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Harga Beli <span class="text-red-600">*</span>
            </label>
            <input
              :value="form.harga_beli"
              @input="
                emit('update:form', {
                  ...form,
                  harga_beli: Number(($event.target as HTMLInputElement).value),
                })
              "
              type="number"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Harga Jual <span class="text-red-600">*</span>
            </label>
            <input
              :value="form.harga_jual"
              @input="
                emit('update:form', {
                  ...form,
                  harga_jual: Number(($event.target as HTMLInputElement).value),
                })
              "
              type="number"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Batas Minimal Stok <span class="text-red-600">*</span>
          </label>
          <input
            :value="form.batas_minimal_stok"
            @input="
              emit('update:form', {
                ...form,
                batas_minimal_stok: Number(
                  ($event.target as HTMLInputElement).value,
                ),
              })
            "
            type="number"
            min="0"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">
            Alert akan muncul jika stok mencapai nilai ini
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            :value="form.deskripsi"
            @input="
              emit('update:form', {
                ...form,
                deskripsi: ($event.target as HTMLInputElement).value,
              })
            "
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
