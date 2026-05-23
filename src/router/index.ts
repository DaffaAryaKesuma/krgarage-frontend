import { createRouter, createWebHistory } from "vue-router";

// Layouts
import PelangganLayout from "../components/layouts/PelangganLayout.vue";
import AdminLayout from "../components/layouts/AdminLayout.vue";
import MekanikLayout from "../components/layouts/MekanikLayout.vue";
import PemilikLayout from "../components/layouts/PemilikLayout.vue";

import { getRedirectPathForRole, normalizeUserRole } from "@/utils/roleRoutes";

// Halaman Publik
import Beranda from "../pages/Beranda.vue";

// Halaman Pelanggan
import PelangganDasbor from "../pages/pelanggan/PelangganDasbor/PelangganDasbor.vue";
import PelangganVespasPage from "../pages/pelanggan/PelangganVespasPage/PelangganVespasPage.vue";
import PelangganPemesananPage from "../pages/pelanggan/PelangganPemesananPage/PelangganPemesananPage.vue";
import PelangganRiwayatPage from "../pages/pelanggan/PelangganRiwayatPage/PelangganRiwayatPage.vue";
import PelangganPemesananDetail from "../pages/pelanggan/PelangganPemesananDetail/PelangganPemesananDetail.vue";

// Halaman admin
import AdminDasbor from "../pages/admin/AdminDasbor/AdminDasbor.vue";
import AdminPemesanan from "../pages/admin/AdminPemesanan/AdminPemesanan.vue";
import AdminLayanan from "../pages/admin/AdminLayanan/AdminLayanan.vue";
import AdminPemesananDetail from "../pages/admin/AdminPemesananDetail/AdminPemesananDetail.vue";
import AdminKeuanganLaporan from "../pages/admin/AdminKeuanganLaporan/AdminKeuanganLaporan.vue";
import AdminInventaris from "../pages/admin/AdminInventaris/AdminInventaris.vue";
import AdminKaryawan from "../pages/admin/AdminKaryawan/AdminKaryawan.vue";

// Halaman mekanik
import MekanikDasbor from "../pages/mekanik/MekanikDasbor/MekanikDasbor.vue";

// Halaman pemilik
import PemilikDasbor from "../pages/pemilik/PemilikDasbor/PemilikDasbor.vue";
import PemilikKeuangan from "../pages/pemilik/PemilikKeuangan/PemilikKeuangan.vue";
import PemilikInventarisAnalisa from "../pages/pemilik/PemilikInventarisAnalisa/PemilikInventarisAnalisa.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rute Publik (tanpa login)
    {
      path: "/",
      name: "beranda",
      component: Beranda,
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
          component: PelangganDasbor,
        },
        {
          path: "vespa-saya",
          name: "pelanggan-vespa-saya",
          component: PelangganVespasPage,
        },
        {
          path: "pemesanan",
          name: "pelanggan-pemesanan",
          component: PelangganPemesananPage,
        },
        {
          path: "riwayat",
          name: "pelanggan-riwayat",
          component: PelangganRiwayatPage,
        },
        {
          path: "riwayat/:id",
          name: "pelanggan-riwayat-detail",
          component: PelangganPemesananDetail,
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
          component: AdminDasbor,
        },
        {
          path: "pemesanan",
          name: "admin-pemesanan",
          component: AdminPemesanan,
        },
        {
          path: "pemesanan/:id",
          name: "admin-pemesanan-detail",
          component: AdminPemesananDetail,
        },
        {
          path: "layanan",
          name: "admin-layanan",
          component: AdminLayanan,
        },
        {
          path: "laporan-keuangan",
          name: "admin-laporan-keuangan",
          component: AdminKeuanganLaporan,
        },
        {
          path: "inventaris",
          name: "admin-inventaris",
          component: AdminInventaris,
        },
        {
          path: "karyawan",
          name: "admin-karyawan",
          component: AdminKaryawan,
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
          component: MekanikDasbor,
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
          component: PemilikDasbor,
        },
        {
          path: "laporan-keuangan",
          name: "pemilik-laporan-keuangan",
          component: PemilikKeuangan,
        },
        {
          path: "analisa-inventaris",
          name: "pemilik-analisa-inventaris",
          component: PemilikInventarisAnalisa,
        },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let user: any = null;
  if (userString) {
    try {
      const parsed = JSON.parse(userString);
      // Pastikan user valid (bukan null/undefined yang tersimpan sebagai string)
      if (parsed && typeof parsed === "object" && parsed.role) {
        user = parsed;
      }
    } catch {
      user = null;
    }
  }

  // Kalau ada token tapi user corrupt/tidak valid, bersihkan keduanya
  if (token && !user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return next({ name: "beranda" });
  }

  const isLoggedIn = !!token && !!user;
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
