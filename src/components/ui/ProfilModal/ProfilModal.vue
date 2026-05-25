<script setup lang="ts">
import { formatNama } from "@/utils/format";
import { useProfilModal } from "@/components/ui/ProfilModal/useProfilModal";
import { getButtonClass } from "@/utils/buttonVariants";

const props = defineProps<{ show: boolean }>();
const emit = defineEmits<{ close: [] }>();

const {
  loading,
  user,
  profilForm,
  passwordForm,
  inputClass,
  labelClass,
  handleUpdateProfil,
  handleGantiPassword,
} = useProfilModal(() => props.show, () => emit("close"));
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div
      class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200 custom-scrollbar"
    >
      <!-- Header -->
      <div
        class="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between"
      >
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-account-circle text-red-600"></i>
          Profil Saya
        </h2>
        <button
          @click="emit('close')"
          class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <div v-if="user" class="p-6 space-y-8">
        <!-- Profile Info Section -->
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Avatar -->
          <div
            class="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0"
          >
            <div
              class="h-28 w-28 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-red-50"
            >
              {{
                formatNama(user.nama)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              }}
            </div>
            <div class="text-center">
              <span
                class="inline-block px-3 py-1 rounded-full bg-red-100 text-xs font-bold text-red-700 capitalize tracking-widest"
              >
                {{ user.role }}
              </span>
            </div>
          </div>

          <!-- Form Info -->
          <form
            @submit.prevent="handleUpdateProfil"
            class="flex-1 w-full space-y-4"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">Nama Lengkap</label>
                <input
                  v-model="profilForm.nama"
                  type="text"
                  :class="inputClass"
                  required
                />
              </div>
              <div>
                <label :class="labelClass">Nomor Telepon</label>
                <input
                  v-model="profilForm.no_telepon"
                  type="tel"
                  @input="
                    profilForm.no_telepon = profilForm.no_telepon.replace(
                      /[^0-9]/g,
                      '',
                    )
                  "
                  :class="inputClass"
                  required
                />
              </div>
            </div>

            <div>
              <label :class="labelClass">Email</label>
              <input
                v-model="profilForm.email"
                type="email"
                :class="inputClass"
                required
              />
            </div>

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                :disabled="loading"
                :class="getButtonClass('primary', 'md', 'rounded-xl px-6 font-bold shadow-md')"
              >
                <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
                Simpan Profil
              </button>
            </div>
          </form>
        </div>

        <!-- Password Section -->
        <div>
          <h3
            class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
          >
            <i class="mdi mdi-shield-lock text-red-600"></i>
            Ganti Password
          </h3>
          <form @submit.prevent="handleGantiPassword" class="space-y-4">
            <div>
              <label :class="labelClass">Password Saat Ini</label>
              <input
                v-model="passwordForm.password_lama"
                type="password"
                :class="inputClass"
                required
                placeholder="••••••••"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">Password Baru</label>
                <input
                  v-model="passwordForm.password_baru"
                  type="password"
                  :class="inputClass"
                  required
                  placeholder="Min. 8 karakter, 1 huruf besar, dan 1 angka"
                />
              </div>
              <div>
                <label :class="labelClass">Konfirmasi Password</label>
                <input
                  v-model="passwordForm.password_baru_confirmation"
                  type="password"
                  :class="inputClass"
                  required
                  placeholder="Ulangi password"
                />
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                :disabled="loading"
                :class="getButtonClass('dangerOutline', 'md', 'rounded-xl border-2 px-6 font-bold')"
              >
                <i v-if="loading" class="mdi mdi-loading mdi-spin"></i>
                Ganti Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
