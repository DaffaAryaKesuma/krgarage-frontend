<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";
import {
  useKaryawanFormModal,
  FIELD_WRAPPER_CLASS,
  ICON_PREFIX_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  type FormData,
} from "@/components/admin/karyawan/KaryawanFormModal/useKaryawanFormModal";
import { getToneTextClass } from "@/utils/badgeVariants";
import { getButtonClass } from "@/utils/buttonVariants";

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
                    ? `mdi mdi-account-edit ${getToneTextClass('primary')}`
                    : `mdi mdi-account-plus ${getToneTextClass('primary')}`
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
              <label :class="LABEL_CLASS">Nama Lengkap</label>
              <div :class="FIELD_WRAPPER_CLASS">
                <div :class="ICON_PREFIX_CLASS">
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
              <label :class="LABEL_CLASS">Email</label>
              <div :class="FIELD_WRAPPER_CLASS">
                <div :class="ICON_PREFIX_CLASS">
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
              <label :class="LABEL_CLASS">Nomor Telepon</label>
              <div :class="FIELD_WRAPPER_CLASS">
                <div :class="ICON_PREFIX_CLASS">
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
                <label :class="LABEL_CLASS">
                  Password
                  <span
                    v-if="isEditMode"
                    class="text-[10px] font-normal text-gray-500 block -mt-0.5 leading-none"
                  >(Opsional)</span>
                </label>
                <div :class="FIELD_WRAPPER_CLASS">
                  <div :class="ICON_PREFIX_CLASS">
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

            <div
              class="grid grid-cols-2 gap-3 pt-5 mt-2 sm:flex-row sm:justify-end border-t border-gray-100"
            >
              <button
                type="button"
                @click="emit('close')"
                :class="getButtonClass('secondary', 'md', 'w-full')"
              >
                Batal
              </button>
              <button
                type="submit"
                :class="getButtonClass('primary', 'md', 'w-full')"
              >
                <i class="mdi mdi-content-save text-lg leading-none"></i>
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>
