import { createRouter, createWebHistory } from "vue-router";

// Layouts
import CustomerLayout from "../components/layouts/CustomerLayout.vue";
import AdminLayout from "../components/layouts/AdminLayout.vue";
import MechanicLayout from "../components/layouts/MechanicLayout.vue";
import OwnerLayout from "../components/layouts/OwnerLayout.vue";

import { getRedirectPathForRole } from "@/utils/roleRoutes";

// Halaman Publik
import HomePage from "../pages/HomePage.vue";

// Halaman Customer
import CustomerDashboard from "../pages/customer/CustomerDashboard.vue";
import CustomerVespasPage from "../pages/customer/CustomerVespasPage.vue";
import CustomerBookingPage from "../pages/customer/CustomerBookingPage.vue";
import CustomerHistoryPage from "../pages/customer/CustomerHistoryPage.vue";

// Halaman admin
import AdminDashboard from "../pages/admin/AdminDashboard.vue";
import AdminBookings from "../pages/admin/AdminBookings.vue";
import AdminServices from "../pages/admin/AdminServices.vue";
import AdminBookingDetail from "../pages/admin/AdminBookingDetail.vue";
import AdminFinancialReport from "../pages/admin/AdminFinancialReport.vue";
import AdminInventory from "../pages/admin/AdminInventory.vue";

// Halaman mechanic
import MechanicDashboard from "../pages/mechanic/MechanicDashboard.vue";

// Halaman owner
import OwnerDashboard from "../pages/owner/OwnerDashboard.vue";
import OwnerFinancial from "../pages/owner/OwnerFinancial.vue";
import OwnerInventoryAnalysis from "../pages/owner/OwnerInventoryAnalysis.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rute Publik (tanpa login)
    { path: "/", name: "home", component: HomePage, meta: { guestOnly: true } },

    // Rute Pengguna Biasa (butuh login)
    {
      path: "/app",
      component: CustomerLayout,
      meta: { requiresAuth: true },
      redirect: "/app/dasbor",
      children: [
        {
          path: "dasbor",
          name: "dashboard",
          component: CustomerDashboard,
        },
        {
          path: "vespa-saya",
          name: "my-vespas",
          component: CustomerVespasPage,
        },
        {
          path: "pemesanan",
          name: "bookings",
          component: CustomerBookingPage,
        },
        {
          path: "riwayat",
          name: "history",
          component: CustomerHistoryPage,
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
          name: "admin-dashboard",
          component: AdminDashboard,
        },
        {
          path: "pemesanan",
          name: "admin-bookings",
          component: AdminBookings,
        },
        {
          path: "pemesanan/:id",
          name: "admin-booking-detail",
          component: AdminBookingDetail,
        },
        {
          path: "layanan",
          name: "admin-services",
          component: AdminServices,
        },
        {
          path: "laporan-keuangan",
          name: "admin-financial-report",
          component: AdminFinancialReport,
        },
        {
          path: "inventaris",
          name: "admin-inventory",
          component: AdminInventory,
        },
      ],
    },

    // Rute Mechanic
    {
      path: "/mekanik",
      component: MechanicLayout,
      meta: { requiresAuth: true, requiresMechanic: true },
      redirect: "/mekanik/dasbor",
      children: [
        {
          path: "dasbor",
          name: "mechanic-dashboard",
          component: MechanicDashboard,
        },
      ],
    },

    // Rute Owner
    {
      path: "/pemilik",
      component: OwnerLayout,
      meta: { requiresAuth: true, requiresOwner: true },
      redirect: "/pemilik/dasbor",
      children: [
        {
          path: "dasbor",
          name: "owner-dashboard",
          component: OwnerDashboard,
        },
        {
          path: "laporan-keuangan",
          name: "owner-financial",
          component: OwnerFinancial,
        },
        {
          path: "analisa-inventaris",
          name: "owner-inventory-analysis",
          component: OwnerInventoryAnalysis,
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
  const roleRedirectPath = getRedirectPathForRole(user?.role);

  if (to.meta.guestOnly && isLoggedIn) {
    return next(getRedirectPathForRole(user?.role));
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
    return next({ name: "home" });
  }

  if (to.meta.requiresAdmin && (!user || user.role !== "admin")) {
    return next(user ? roleRedirectPath : { name: "home" });
  }

  if (to.meta.requiresMechanic && (!user || user.role !== "mekanik")) {
    return next(user ? roleRedirectPath : { name: "home" });
  }

  if (to.meta.requiresOwner && (!user || user.role !== "owner")) {
    return next(user ? roleRedirectPath : { name: "home" });
  }

  // Mark that user is logged in (for session expiration detection)
  if (isLoggedIn) {
    sessionStorage.setItem("wasLoggedIn", "true");
  }

  next();
});

export default router;
