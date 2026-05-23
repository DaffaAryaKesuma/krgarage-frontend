import { ref, onMounted } from "vue";
import axios from "axios";
import { getImageUrl } from "@/utils/format";
import { API_URL } from "@/utils/api";
import { handleApiError, logError } from "@/utils/errorHandler";
import { useToast } from "@/utils/useToast";

export type Layanan = {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number | null;
  gambar: string;
};

export function useBerandaLayanan() {
  const toast = useToast();
  const layanan = ref<Layanan[]>([]);
  const isLoading = ref(true);

  const fetchLayanan = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get(`${API_URL}/layanan`);
      layanan.value = (response.data || []).map((s: any) => ({
        ...s,
        gambar: getImageUrl(s.gambar, API_URL),
      }));
    } catch (error: any) {
      logError(error, "fetchLayanan");
      toast.error(handleApiError(error));
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchLayanan);

  return { layanan, isLoading };
}
