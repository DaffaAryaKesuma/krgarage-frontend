import { ref } from "vue";
import type { ApiPagination } from "@/types/pagination";

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

export function useApiPagination(defaultPerPage = 10) {
  const pagination = ref<ApiPagination>(
    createDefaultPagination(defaultPerPage),
  );

  const resetPagination = () => {
    pagination.value = createDefaultPagination(defaultPerPage);
  };

  const setCurrentPage = (page: number) => {
    pagination.value.current_page = page;
  };

  const updateFromApi = (data: Partial<ApiPagination>) => {
    Object.assign(pagination.value, {
      current_page: data.current_page ?? pagination.value.current_page,
      last_page: data.last_page ?? pagination.value.last_page,
      per_page: data.per_page ?? pagination.value.per_page,
      total: data.total ?? pagination.value.total,
      from: data.from ?? 0,
      to: data.to ?? 0,
    });
  };

  return {
    pagination,
    resetPagination,
    setCurrentPage,
    updateFromApi,
  };
}
