<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  useKaryawanFormModal,
  INPUT_CLASS,
  type FormData,
} from "@/components/admin/karyawan/KaryawanFormModal/useKaryawanFormModal";

const props = defineProps<{
  show: boolean;
  isEditMode: boolean;
  initialData?: Partial<FormData>;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: FormData];
}>();

const { formData, handleSubmit } = useKaryawanFormModal(props, emit);
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 transition-opacity bg-gray-900/60 backdrop-blur-sm"
          @click="emit('close')"
        ></div>

        <!-- Modal Panel -->
        <div
          class="relative w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl sm:my-8"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between pb-4 border-b border-gray-100"
          >
            <h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <i
                :class="
                  isEditMode
                    ? 'mdi mdi-account-edit text-blue-600'
                    : 'mdi mdi-account-plus text-blue-600'
                "
              ></i>
              {{ isEditMode ? "Edit Karyawan" : "Tambah Karyawan Baru" }}
            </h3>
          </div>

          <!-- Form -->
          <form
            @submit.prevent="handleSubmit"
            autocomplete="off"
            class="mt-5 space-y-4"
          >
            <!-- Nama -->
            <div>
              <label class="block mb-1.5 text-sm font-medium text-gray-700">Nama Lengkap</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i class="text-gray-400 mdi mdi-account-outline text-lg leading-none"></i>
                </div>
                <input
                  v-model="formData.nama"
                  autocomplete="off"
                  type="text"
                  required
                  minlength="3"
                  pattern="^[a-zA-Z\s]*$"
                  title="Nama hanya boleh berisi huruf dan spasi, minimal 3 karakter"
                  placeholder="Masukkan nama lengkap"
                  :class="INPUT_CLASS"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i class="text-gray-400 mdi mdi-email-outline text-lg leading-none"></i>
                </div>
                <input
                  v-model="formData.email"
                  autocomplete="new-password"
                  type="email"
                  required
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                  title="Masukkan alamat email yang valid (contoh: nama@domain.com)"
                  placeholder="nama@email.com"
                  :class="INPUT_CLASS"
                />
              </div>
            </div>

            <!-- No. Telepon -->
            <div>
              <label class="block mb-1.5 text-sm font-medium text-gray-700">Nomor Telepon</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i class="text-gray-400 mdi mdi-phone-outline text-lg leading-none"></i>
                </div>
                <input
                  v-model="formData.no_telepon"
                  autocomplete="off"
                  type="tel"
                  required
                  minlength="10"
                  maxlength="15"
                  pattern="^[0-9+]*$"
                  title="Nomor telepon hanya boleh berisi angka (opsional awalan +), minimal 10 digit"
                  placeholder="08xxxxxxxxxx"
                  :class="INPUT_CLASS"
                />
              </div>
            </div>

            <!-- Role + Password -->
            <div class="grid gap-4 grid-cols-2">
              <div>
                <CustomSelect
                  v-model="formData.role"
                  label="Role"
                  :options="[
                    { value: 'mekanik', label: 'Mekanik' },
                    { value: 'admin', label: 'Admin' },
                  ]"
                />
              </div>
              <div>
                <label class="block mb-1.5 text-sm font-medium text-gray-700">
                  Password
                  <span
                    v-if="isEditMode"
                    class="text-[10px] font-normal text-gray-500 block -mt-0.5 leading-none"
                  >(Opsional)</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="text-gray-400 mdi mdi-lock-outline text-lg leading-none"></i>
                  </div>
                  <input
                    v-model="formData.password"
                    autocomplete="new-password"
                    type="password"
                    :required="!isEditMode"
                    minlength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Harus 8+ karakter, berisi huruf besar, huruf kecil, dan angka"
                    placeholder="Minimal 8 karakter"
                    :class="INPUT_CLASS"
                  />
                </div>
              </div>
            </div>

            <!-- Footer Buttons -->
            <div
              class="grid grid-cols-2 gap-3 pt-5 mt-2 sm:flex-row sm:justify-end border-t border-gray-100"
            >
              <button
                type="button"
                @click="emit('close')"
                class="inline-flex justify-center w-full px-5 py-2.5 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:w-auto"
              >
                Batal
              </button>
              <button
                type="submit"
                class="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-medium text-white transition-all bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                <i class="mr-2 mdi mdi-content-save text-lg leading-none"></i>
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>
