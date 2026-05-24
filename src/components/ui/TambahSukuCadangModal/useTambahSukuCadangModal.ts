import { ref, computed, watch } from "vue";
import type { SukuCadangRingkasan } from "@/types/inventaris";
import { scrollLock } from "@/composables/scrollLock";

export interface KeranjangItem {
  sukucadang: SukuCadangRingkasan;
  quantity: number;
}

export interface TambahSukuCadangModalEmit {
  (e: "close"): void;
  (e: "submit", items: { sukucadangId: number; quantity: number }[]): void;
}

export function useTambahSukuCadangModal(
  props: {
    show: boolean;
    sukuCadang: SukuCadangRingkasan[];
    isLoading?: boolean;
    isSubmitting?: boolean;
  },
  emit: TambahSukuCadangModalEmit,
) {
  scrollLock(() => props.show);

  const searchQuery = ref("");
  const keranjang = ref<KeranjangItem[]>([]);
  const activeCardId = ref<number | null>(null);
  const activeQuantity = ref(1);

  watch(
    () => props.show,
    (val) => {
      if (val) {
        searchQuery.value = "";
        keranjang.value = [];
        activeCardId.value = null;
        activeQuantity.value = 1;
      }
    },
  );

  const idSudahDiKeranjang = computed(
    () => new Set(keranjang.value.map((item) => item.sukucadang.id)),
  );

  const filteredSukuCadang = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    return props.sukuCadang.filter(
      (sc) =>
        !idSudahDiKeranjang.value.has(sc.id) &&
        (sc.nama_suku_cadang.toLowerCase().includes(query) ||
          (sc.kategori || "").toLowerCase().includes(query)),
    );
  });

  const grandTotal = computed(() =>
    keranjang.value.reduce(
      (sum, item) => sum + item.sukucadang.harga_jual * item.quantity,
      0,
    ),
  );

  const getStokBadge = (sc: SukuCadangRingkasan) => {
    if (sc.jumlah_stok === 0) return { label: "Habis", class: "bg-red-100 text-red-700" };
    if (sc.stok_menipis) return { label: `Kritis: ${sc.jumlah_stok}`, class: "bg-orange-100 text-orange-700" };
    return { label: `Stok: ${sc.jumlah_stok}`, class: "bg-green-100 text-green-700" };
  };

  const selectCard = (sc: SukuCadangRingkasan) => {
    if (activeCardId.value === sc.id) {
      activeCardId.value = null;
      activeQuantity.value = 1;
    } else {
      activeCardId.value = sc.id;
      activeQuantity.value = 1;
    }
  };

  const decrementQty = () => { if (activeQuantity.value > 1) activeQuantity.value--; };
  const incrementQty = (max: number) => { if (activeQuantity.value < max) activeQuantity.value++; };

  const tambahKeKeranjang = (sc: SukuCadangRingkasan) => {
    keranjang.value.push({ sukucadang: sc, quantity: activeQuantity.value });
    activeCardId.value = null;
    activeQuantity.value = 1;
  };

  const hapusDariKeranjang = (index: number) => {
    keranjang.value.splice(index, 1);
  };

  const handleSubmit = () => {
    if (!keranjang.value.length) return;
    emit("submit", keranjang.value.map((item) => ({
      sukucadangId: item.sukucadang.id,
      quantity: item.quantity,
    })));
  };

  const handleClose = () => emit("close");

  return {
    searchQuery,
    keranjang,
    activeCardId,
    activeQuantity,
    filteredSukuCadang,
    grandTotal,
    getStokBadge,
    selectCard,
    decrementQty,
    incrementQty,
    tambahKeKeranjang,
    hapusDariKeranjang,
    handleSubmit,
    handleClose,
  };
}
