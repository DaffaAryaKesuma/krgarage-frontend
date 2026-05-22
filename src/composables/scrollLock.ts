import { watch, onUnmounted } from "vue";

export function scrollLock(showGetter: () => boolean) {
  let hasLocked = false;

  const lockScroll = () => {
    if (!hasLocked) {
      const activeCount = ((window as any).__activeModalsCount || 0) + 1;
      (window as any).__activeModalsCount = activeCount;

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

  const unlockScroll = () => {
    if (hasLocked) {
      const activeCount = Math.max(0, ((window as any).__activeModalsCount || 0) - 1);
      (window as any).__activeModalsCount = activeCount;

      if (activeCount === 0) {
        const scrollPos = (window as any).__krg_scrollPosition || 0;

        // Temporarily override HTML scroll-behavior to auto to prevent smooth scroll animation during restore
        const htmlEl = document.documentElement;
        const originalScrollBehavior = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = "auto";

        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        window.scrollTo(0, scrollPos);

        // Restore original scroll-behavior
        htmlEl.style.scrollBehavior = originalScrollBehavior;

        delete (window as any).__krg_scrollPosition;
      }

      hasLocked = false;
    }
  };

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

  onUnmounted(() => {
    unlockScroll();
  });
}
