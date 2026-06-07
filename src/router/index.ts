// createRouter membuat konfigurasi router Vue.
import { createRouter, createWebHistory } from "vue-router";

// Layouts membungkus halaman berdasarkan role pengguna.
import PelangganLayout from "../components/layouts/PelangganLayout.vue";
import AdminLayout from "../components/layouts/AdminLayout.vue";
import MekanikLayout from "../components/layouts/MekanikLayout.vue";
import PemilikLayout from "../components/layouts/PemilikLayout.vue";

// Helper role dipakai untuk redirect sesuai role login.
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
import PemilikAuditAktivitas from "../pages/pemilik/PemilikAuditAktivitas/PemilikAuditAktivitas.vue";

// Router utama aplikasi.
const router = createRouter({
  // createWebHistory membuat URL normal tanpa tanda #.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rute Publik (tanpa login)
    {
      path: "/",
      name: "beranda",
      component: Beranda,
      // guestOnly berarti user yang sudah login akan dialihkan dari halaman ini.
      meta: { guestOnly: true },
    },

    // Rute Pengguna Biasa (butuh login)
    {
      path: "/app",
      component: PelangganLayout,
      // Route pelanggan wajib login dan wajib role pelanggan.
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
      // Route admin wajib login dan wajib role admin.
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
      // Route mekanik wajib login dan wajib role mekanik.
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
      // Route pemilik wajib login dan wajib role pemilik.
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
        {
          path: "audit-aktivitas",
          name: "pemilik-audit-aktivitas",
          component: PemilikAuditAktivitas,
        },
      ],
    },
  ],
});

// Navigation guard berjalan setiap kali pengguna berpindah halaman.
router.beforeEach((to, _from, next) => {
  // Token dan user disimpan saat login berhasil.
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  // User dibuat any karena berasal dari JSON localStorage.
  let user: any = null;
  if (userString) {
    try {
      // Parse user dari string JSON.
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
    // Data login dianggap rusak, jadi token dan user dihapus.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return next({ name: "beranda" });
  }

  // User dianggap login hanya jika token dan data user sama-sama ada.
  const isLoggedIn = !!token && !!user;
  // Role dinormalisasi agar variasi tulisan role tetap terbaca.
  const normalizedRole = normalizeUserRole(user?.role);
  // Path default setelah login berdasarkan role.
  const roleRedirectPath = getRedirectPathForRole(normalizedRole);

  // Jika user sudah login membuka halaman guestOnly, arahkan ke dashboard role-nya.
  if (to.meta.guestOnly && isLoggedIn) {
    return next(roleRedirectPath);
  }

  // Jika route butuh login tetapi user belum login, kembali ke beranda.
  if (to.meta.requiresAuth && !isLoggedIn) {
    // Check if user was previously logged in (session expired)
    const wasLoggedIn = sessionStorage.getItem("wasLoggedIn") === "true";
    if (wasLoggedIn) {
      // Flag ini dipakai untuk menampilkan pesan sesi habis hanya sekali.
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

  // Cegah user non-admin membuka halaman admin.
  if (to.meta.requiresAdmin && (!user || normalizedRole !== "admin")) {
    return next(user ? roleRedirectPath : { name: "beranda" });
  }

  // Cegah user non-mekanik membuka halaman mekanik.
  if (to.meta.requiresMekanik && (!user || normalizedRole !== "mekanik")) {
    return next(user ? roleRedirectPath : { name: "beranda" });
  }

  // Cegah user non-pemilik membuka halaman pemilik.
  if (to.meta.requiresPemilik && (!user || normalizedRole !== "pemilik")) {
    return next(user ? roleRedirectPath : { name: "beranda" });
  }

  // Cegah user non-pelanggan membuka halaman pelanggan.
  if (to.meta.requiresPelanggan && (!user || normalizedRole !== "pelanggan")) {
    return next(user ? roleRedirectPath : { name: "beranda" });
  }

  // Mark that user is logged in (for session expiration detection)
  if (isLoggedIn) {
    // Flag ini membantu membedakan user belum login dengan sesi yang habis.
    sessionStorage.setItem("wasLoggedIn", "true");
  }

  // Lanjutkan navigasi jika semua syarat terpenuhi.
  next();
});

// Export router agar bisa dipakai di main.ts.
export default router;
