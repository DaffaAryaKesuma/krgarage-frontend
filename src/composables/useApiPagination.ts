import { ref } from "vue";
import type { ApiPagination } from "@/types/pagination";

// Membuat nilai pagination awal yang aman sebelum response API datang.
function createDefaultPagination(perPage: number): ApiPagination {
  return {
    current_page: 1,
    last_page: 1,
    per_page: perPage,
    total: 0,
    from: 0,
    to: 0,
  };
}

// Composable reusable untuk halaman yang memakai pagination dari API Laravel.
export function useApiPagination(defaultPerPage = 10) {
  // State pagination disimpan sebagai ref agar perubahan otomatis terbaca komponen.
  const pagination = ref<ApiPagination>(
    createDefaultPagination(defaultPerPage),
  );

  // Mengembalikan pagination ke kondisi awal.
  const resetPagination = () => {
    pagination.value = createDefaultPagination(defaultPerPage);
  };

  // Mengubah halaman aktif secara lokal.
  const setCurrentPage = (page: number) => {
    pagination.value.current_page = page;
  };

  // Mengupdate pagination dari meta response API.
  const updateFromApi = (data: Partial<ApiPagination>) => {
    // Gunakan nilai baru jika ada, kalau tidak pakai nilai lama/fallback.
    Object.assign(pagination.value, {
      current_page: data.current_page ?? pagination.value.current_page,
      last_page: data.last_page ?? pagination.value.last_page,
      per_page: data.per_page ?? pagination.value.per_page,
      total: data.total ?? pagination.value.total,
      from: data.from ?? 0,
      to: data.to ?? 0,
    });
  };

  // Return helper pagination agar halaman bisa memakainya.
  return {
    pagination,
    resetPagination,
    setCurrentPage,
    updateFromApi,
  };
}
