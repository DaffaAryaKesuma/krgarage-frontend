import { watch, onUnmounted } from "vue";

// Mengunci scroll body saat modal terbuka agar halaman belakang tidak ikut bergerak.
export function scrollLock(showGetter: () => boolean) {
  // Menandai apakah instance composable ini sudah mengunci scroll.
  let hasLocked = false;

  // Mengunci scroll body.
  const lockScroll = () => {
    if (!hasLocked) {
      // Hitung jumlah modal aktif agar scroll baru dibuka setelah semua modal tertutup.
      const activeCount = ((window as any).__activeModalsCount || 0) + 1;
      (window as any).__activeModalsCount = activeCount;

      // Jika ini modal pertama, simpan posisi scroll dan freeze body.
      if (activeCount === 1) {
        (window as any).__krg_scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPos = (window as any).__krg_scrollPosition;

        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPos}px`;
        document.body.style.width = "100%";
      }

      hasLocked = true;
    }
  };

  // Membuka kembali scroll body.
  const unlockScroll = () => {
    if (hasLocked) {
      // Kurangi jumlah modal aktif, minimal 0.
      const activeCount = Math.max(0, ((window as any).__activeModalsCount || 0) - 1);
      (window as any).__activeModalsCount = activeCount;

      // Jika sudah tidak ada modal aktif, kembalikan scroll body.
      if (activeCount === 0) {
        const scrollPos = (window as any).__krg_scrollPosition || 0;

        // Matikan sementara smooth scroll agar restore posisi tidak beranimasi.
        const htmlEl = document.documentElement;
        const originalScrollBehavior = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = "auto";

        // Bersihkan style body yang dipasang saat lock.
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // Kembalikan posisi scroll seperti sebelum modal terbuka.
        window.scrollTo(0, scrollPos);

        // Kembalikan scroll-behavior asli.
        htmlEl.style.scrollBehavior = originalScrollBehavior;

        delete (window as any).__krg_scrollPosition;
      }

      hasLocked = false;
    }
  };

  // Pantau nilai show modal; true berarti lock, false berarti unlock.
  watch(
    showGetter,
    (val) => {
      if (val) {
        lockScroll();
      } else {
        unlockScroll();
      }
    },
    { immediate: true }
  );

  // Jika komponen modal unmount saat masih lock, pastikan scroll dibuka lagi.
  onUnmounted(() => {
    unlockScroll();
  });
}
