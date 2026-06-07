<script setup lang="ts">
// Format nama untuk avatar inisial.
import { formatNama } from "@/utils/format";
// Composable logic profil.
import { useProfilModal } from "@/components/ui/ProfilModal/useProfilModal";
// Helper tombol.
import { getButtonClass, getIconButtonClass } from "@/utils/buttonVariants";
// Helper warna dan badge role.
import {
  getGradientToneClass,
  getRoleBadgeClass,
  getToneTextClass,
} from "@/utils/badgeVariants";

// show menentukan modal terbuka/tutup.
const props = defineProps<{ show: boolean }>();
// close dikirim ke parent saat modal ditutup.
const emit = defineEmits<{ close: [] }>();

// Ambil state dan handler dari composable.
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
  <!-- Overlay modal profil. -->
  <div
    v-if="show"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <!-- Card modal profil. -->
    <div
      class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200 custom-scrollbar"
    >
      <!-- Header modal. -->
      <div
        class="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between"
      >
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i :class="['mdi mdi-account-circle', getToneTextClass('primary')]"></i>
          Profil Saya
        </h2>
        <button
          @click="emit('close')"
          :class="getIconButtonClass('neutral', 'md')"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <!-- Konten hanya tampil jika data user tersedia. -->
      <div v-if="user" class="p-6 space-y-8">
        <!-- Section profil utama. -->
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Avatar inisial dari nama user. -->
          <div
            class="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0"
          >
            <div
              :class="[
                'h-28 w-28 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-gray-100',
                getGradientToneClass('primary'),
              ]"
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
              <span :class="[getRoleBadgeClass(user.role), 'uppercase tracking-widest']">
                {{ user.role }}
              </span>
            </div>
          </div>

          <!-- Form update profil. -->
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
                <!-- Input telepon hanya mengizinkan angka. -->
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
              <!-- Tombol submit profil. -->
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

        <!-- Section ganti password. -->
        <div>
          <h3
            class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
          >
            <i :class="['mdi mdi-shield-lock', getToneTextClass('primary')]"></i>
            Ganti Password
          </h3>
          <!-- Form ganti password. -->
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
              <!-- Tombol submit ganti password. -->
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
