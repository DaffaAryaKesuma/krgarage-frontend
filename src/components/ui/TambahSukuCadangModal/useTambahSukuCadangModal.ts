import { ref, computed, watch } from "vue";
import type { SukuCadangRingkasan } from "@/types/inventaris";
// Mengunci scroll halaman belakang saat modal terbuka.
import { scrollLock } from "@/composables/scrollLock";
// Helper badge stok inventaris.
import { getInventoryBadgeClass } from "@/utils/badgeVariants";

// Bentuk item yang disimpan di keranjang modal.
export interface KeranjangItem {
  sukucadang: SukuCadangRingkasan;
  quantity: number;
}

// Bentuk event yang bisa dikirim modal ke parent.
export interface TambahSukuCadangModalEmit {
  (e: "close"): void;
  (e: "submit", items: { sukucadangId: number; quantity: number }[]): void;
}

// Composable logic modal tambah suku cadang.
export function useTambahSukuCadangModal(
  props: {
    show: boolean;
    sukuCadang: SukuCadangRingkasan[];
    isLoading?: boolean;
    isSubmitting?: boolean;
  },
  emit: TambahSukuCadangModalEmit,
) {
  // Lock scroll saat modal tampil.
  scrollLock(() => props.show);

  // Query pencarian suku cadang.
  const searchQuery = ref("");
  // Daftar item yang sudah dipilih.
  const keranjang = ref<KeranjangItem[]>([]);
  // Card yang sedang aktif/dipilih.
  const activeCardId = ref<number | null>(null);
  // Quantity untuk card aktif.
  const activeQuantity = ref(1);

  // Reset isi modal setiap kali modal dibuka.
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

  // Set id suku cadang yang sudah masuk keranjang.
  const idSudahDiKeranjang = computed(
    () => new Set(keranjang.value.map((item) => item.sukucadang.id)),
  );

  // Filter suku cadang berdasarkan pencarian dan yang belum masuk keranjang.
  const filteredSukuCadang = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    return props.sukuCadang.filter(
      (sc) =>
        !idSudahDiKeranjang.value.has(sc.id) &&
        (sc.nama_suku_cadang.toLowerCase().includes(query) ||
          (sc.kategori || "").toLowerCase().includes(query)),
    );
  });

  // Total harga seluruh item keranjang.
  const grandTotal = computed(() =>
    keranjang.value.reduce(
      (sum, item) => sum + item.sukucadang.harga_jual * item.quantity,
      0,
    ),
  );

  // Menentukan label dan warna badge stok.
  const getStokBadge = (sc: SukuCadangRingkasan) => {
    if (sc.jumlah_stok === 0) {
      return { label: "Habis", class: getInventoryBadgeClass("habis") };
    }

    if (sc.stok_menipis) {
      return {
        label: `Kritis: ${sc.jumlah_stok}`,
        class: getInventoryBadgeClass("kritis"),
      };
    }

    return {
      label: `Stok: ${sc.jumlah_stok}`,
      class: getInventoryBadgeClass("aman"),
    };
  };

  // Memilih/membatalkan card aktif.
  const selectCard = (sc: SukuCadangRingkasan) => {
    if (activeCardId.value === sc.id) {
      activeCardId.value = null;
      activeQuantity.value = 1;
    } else {
      activeCardId.value = sc.id;
      activeQuantity.value = 1;
    }
  };

  // Mengurangi quantity minimal sampai 1.
  const decrementQty = () => { if (activeQuantity.value > 1) activeQuantity.value--; };
  // Menambah quantity maksimal sampai stok tersedia.
  const incrementQty = (max: number) => { if (activeQuantity.value < max) activeQuantity.value++; };

  // Memasukkan card aktif ke keranjang.
  const tambahKeKeranjang = (sc: SukuCadangRingkasan) => {
    keranjang.value.push({ sukucadang: sc, quantity: activeQuantity.value });
    activeCardId.value = null;
    activeQuantity.value = 1;
  };

  // Menghapus item dari keranjang berdasarkan index.
  const hapusDariKeranjang = (index: number) => {
    keranjang.value.splice(index, 1);
  };

  // Mengirim item terpilih ke parent dalam payload sederhana.
  const handleSubmit = () => {
    if (!keranjang.value.length) return;
    emit("submit", keranjang.value.map((item) => ({
      sukucadangId: item.sukucadang.id,
      quantity: item.quantity,
    })));
  };

  // Menutup modal lewat event close.
  const handleClose = () => emit("close");

  // State dan aksi yang dipakai template modal.
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
