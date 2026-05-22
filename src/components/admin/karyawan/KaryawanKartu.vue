<script setup lang="ts">
import { formatDateShort } from "@/utils/date";

interface Karyawan {
  id: number;
  nama: string;
  email: string;
  no_telepon?: string;
  role: string;
  created_at: string;
}

interface Props {
  karyawan: Karyawan;
  currentUserId?: number;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [karyawan: Karyawan];
  delete: [id: number];
}>();
</script>

<template>
  <div
    class="flex flex-col p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
  >
    <!-- Header: Nama + Role Badge -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-bold text-gray-900"><span class="capitalize">{{ karyawan.nama }}</span></h3>
        <p class="text-sm text-gray-500">
          Bergabung: {{ formatDateShort(karyawan.created_at) }}
        </p>
      </div>
      <span
        class="capitalize inline-flex px-2.5 py-0.5 text-xs font-semibold leading-5 rounded-lg"
        :class="
          karyawan.role === 'admin'
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        "
      >
        {{ karyawan.role }}
      </span>
    </div>

    <!-- Info -->
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

    <!-- Aksi -->
    <div
      class="flex items-center justify-end gap-3 pt-4 mt-auto border-t border-gray-100"
    >
      <button
        @click="emit('edit', karyawan)"
        class="flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 border border-transparent rounded-md hover:bg-blue-100 hover:text-blue-600"
      >
        Edit
      </button>
      <button
        v-if="currentUserId !== karyawan.id"
        @click="emit('delete', karyawan.id)"
        class="flex items-center px-4 py-1.5 text-sm font-medium text-gray-700 border border-transparent rounded-md hover:bg-red-100 hover:text-red-600"
      >
        Hapus
      </button>
    </div>
  </div>
</template>
