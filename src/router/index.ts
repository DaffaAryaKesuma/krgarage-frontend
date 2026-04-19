import { createRouter, createWebHistory } from "vue-router";

// Layouts
import PelangganLayout from "../components/layouts/PelangganLayout.vue";
import AdminLayout from "../components/layouts/AdminLayout.vue";
import MekanikLayout from "../components/layouts/MekanikLayout.vue";
import PemilikLayout from "../components/layouts/PemilikLayout.vue";

import { getRedirectPathForRole, normalizeUserRole } from "@/utils/roleRoutes";

// Halaman Publik
import HomePage from "../pages/HomePage.vue";

// Halaman Pelanggan
import PelangganDashboard from "../pages/pelanggan/PelangganDashboard.vue";
import PelangganVespasPage from "../pages/pelanggan/PelangganVespasPage.vue";
import PelangganBookingPage from "../pages/pelanggan/PelangganBookingPage.vue";
import PelangganHistoryPage from "../pages/pelanggan/PelangganHistoryPage.vue";
import PelangganBookingDetail from "../pages/pelanggan/PelangganBookingDetail.vue";

// Halaman admin
import AdminDashboard from "../pages/admin/AdminDashboard.vue";
import AdminBookings from "../pages/admin/AdminBookings.vue";
import AdminServices from "../pages/admin/AdminServices.vue";
import AdminBookingDetail from "../pages/admin/AdminBookingDetail.vue";
import AdminFinancialReport from "../pages/admin/AdminFinancialReport.vue";
import AdminInventory from "../pages/admin/AdminInventory.vue";

// Halaman mekanik
import MekanikDashboard from "../pages/mekanik/MekanikDashboard.vue";

// Halaman pemilik
import PemilikDashboard from "../pages/pemilik/PemilikDashboard.vue";
import PemilikFinancial from "../pages/pemilik/PemilikFinancial.vue";
import PemilikInventoryAnalysis from "../pages/pemilik/PemilikInventoryAnalysis.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rute Publik (tanpa login)
    {
      path: "/",
      name: "beranda",
      component: HomePage,
      meta: { guestOnly: true },
    },

    // Rute Pengguna Biasa (butuh login)
    {
      path: "/app",
      component: PelangganLayout,
      meta: { requiresAuth: true, requiresPelanggan: true },
      redirect: "/app/dasbor",
      children: [
        {
          path: "dasbor",
          name: "pelanggan-dasbor",
          component: PelangganDashboard,
        },
        {
          path: "vespa-saya",
          name: "pelanggan-vespa-saya",
          component: PelangganVespasPage,
        },
        {
          path: "pemesanan",
          name: "pelanggan-pemesanan",
          component: PelangganBookingPage,
        },
        {
          path: "riwayat",
          name: "pelanggan-riwayat",
          component: PelangganHistoryPage,
        },
        {
          path: "riwayat/:id",
          name: "pelanggan-riwayat-detail",
          component: PelangganBookingDetail,
        },
      ],
    },

    // Rute Admin
    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      redirect: "/admin/dasbor",
      children: [
        {
          path: "dasbor",
          name: "admin-dasbor",
          component: AdminDashboard,
        },
        {
          path: "pemesanan",
          name: "admin-pemesanan",
          component: AdminBookings,
        },
        {
          path: "pemesanan/:id",
          name: "admin-pemesanan-detail",
          component: AdminBookingDetail,
        },
        {
          path: "layanan",
          name: "admin-layanan",
          component: AdminServices,
        },
        {
          path: "laporan-keuangan",
          name: "admin-laporan-keuangan",
          component: AdminFinancialReport,
        },
        {
          path: "inventaris",
          name: "admin-inventaris",
          component: AdminInventory,
        },
      ],
    },

    // Rute Mekanik
    {
      path: "/mekanik",
      component: MekanikLayout,
      meta: { requiresAuth: true, requiresMekanik: true },
      redirect: "/mekanik/dasbor",
      children: [
        {
          path: "dasbor",
          name: "mekanik-dasbor",
          component: MekanikDashboard,
        },
      ],
    },

    // Rute Pemilik
    {
      path: "/pemilik",
      component: PemilikLayout,
      meta: { requiresAuth: true, requiresPemilik: true },
      redirect: "/pemilik/dasbor",
      children: [
        {
          path: "dasbor",
          name: "pemilik-dasbor",
          component: PemilikDashboard,
        },
        {
          path: "laporan-keuangan",
          name: "pemilik-laporan-keuangan",
          component: PemilikFinancial,
        },
        {
          path: "analisa-inventaris",
          name: "pemilik-analisa-inventaris",
          component: PemilikInventoryAnalysis,
        },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const isLoggedIn = !!localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let user: any = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch {
      user = null;
    }
  }
  const normalizedRole = normalizeUserRole(user?.role);
  const roleRedirectPath = getRedirectPathForRole(normalizedRole);

  if (to.meta.guestOnly && isLoggedIn) {
    return next(roleRedirectPath);
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Check if user was previously logged in (session expired)
    const wasLoggedIn = sessionStorage.getItem("wasLoggedIn") === "true";
    if (wasLoggedIn) {
      sessionStorage.removeItem("wasLoggedIn");
      // Show toast via global function if available
      if ((window as any).__krg_showToast) {
        (window as any).__krg_showToast(
          "Sesi Anda telah berakhir. Silakan login kembali.",
        );
      }
    }
    return next({ name: "beranda" });
  }

  if (to.meta.requiresAdmin && (!user || normalizedRole !== "admin")) {
    return next(user ? roleRedirectPath : { name: "beranda" });
  }

  if (to.meta.requiresMekanik && (!user || normalizedRole !== "mekanik")) {
    return next(user ? roleRedirectPath : { name: "beranda" });
  }

  if (to.meta.requiresPemilik && (!user || normalizedRole !== "pemilik")) {
    return next(user ? roleRedirectPath : { name: "beranda" });
  }

  if (to.meta.requiresPelanggan && (!user || normalizedRole !== "pelanggan")) {
    return next(user ? roleRedirectPath : { name: "beranda" });
  }

  // Mark that user is logged in (for session expiration detection)
  if (isLoggedIn) {
    sessionStorage.setItem("wasLoggedIn", "true");
  }

  next();
});

export default router;
