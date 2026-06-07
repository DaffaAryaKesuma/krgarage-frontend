<script setup lang="ts">
// Format tanggal bergabung.
import { formatDateShort } from "@/utils/date";
// Badge role dan class tombol.
import { getRoleBadgeClass } from "@/utils/badgeVariants";
import { getButtonClass } from "@/utils/buttonVariants";

// Bentuk data karyawan yang ditampilkan di kartu.
interface Karyawan {
  id: number;
  nama: string;
  email: string;
  no_telepon?: string;
  role: string;
  created_at: string;
}

// Props kartu karyawan.
interface Props {
  karyawan: Karyawan;
  currentUserId?: number;
}

defineProps<Props>();

// Event edit dan delete dikirim ke halaman karyawan.
const emit = defineEmits<{
  edit: [karyawan: Karyawan];
  delete: [id: number];
}>();
</script>

<template>
  <!-- Kartu satu karyawan/admin/mekanik. -->
  <div
    class="flex flex-col p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
  >
    <!-- Header: nama dan badge role. -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-bold text-gray-900"><span class="capitalize">{{ karyawan.nama }}</span></h3>
        <p class="text-sm text-gray-500">
          Bergabung: {{ formatDateShort(karyawan.created_at) }}
        </p>
      </div>
      <span
        :class="[getRoleBadgeClass(karyawan.role), 'capitalize']"
      >
        {{ karyawan.role }}
      </span>
    </div>

    <!-- Info kontak karyawan. -->
    <div class="flex-1 mb-6 space-y-2">
      <div class="flex items-center text-sm text-gray-600">
        <i class="mr-2 text-lg text-gray-400 mdi mdi-email-outline"></i>
        {{ karyawan.email }}
      </div>
      <div class="flex items-center text-sm text-gray-600">
        <i class="mr-2 text-lg text-gray-400 mdi mdi-phone-outline"></i>
        {{ karyawan.no_telepon || "-" }}
      </div>
    </div>

    <!-- Aksi edit/hapus; akun sendiri tidak boleh dihapus. -->
    <div
      class="flex items-center justify-end gap-3 pt-4 mt-auto border-t border-gray-100"
    >
      <button
        @click="emit('edit', karyawan)"
        :class="getButtonClass('infoOutline', 'xs')"
      >
        Edit
      </button>
      <button
        v-if="currentUserId !== karyawan.id"
        @click="emit('delete', karyawan.id)"
        :class="getButtonClass('dangerOutline', 'xs')"
      >
        Hapus
      </button>
    </div>
  </div>
</template>
