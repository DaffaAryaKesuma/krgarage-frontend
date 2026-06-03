import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";
import { notifyKrGarageDataChanged } from "./composables/useRealtimeRefresh";
import "./main.css";
import "@mdi/font/css/materialdesignicons.css";

// Configure axios defaults untuk improve performance awareness
axios.defaults.timeout = 60000; // 60 detik timeout (lebih lama untuk request yang heavy)
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor untuk show loading state
axios.interceptors.request.use(
  (config) => {
    // Inject token ke header Authorization jika ada
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor untuk handle errors
axios.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase();
    const url = String(response.config.url || "");
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method || "");
    const shouldNotify =
      isMutation &&
      !url.includes("/masuk") &&
      !url.includes("/daftar") &&
      !url.includes("/keluar") &&
      !url.includes("/ping") &&
      !url.includes("/notifikasi/");

    if (shouldNotify) {
      notifyKrGarageDataChanged(
        url.includes("/notifikasi") ? "notifikasi.changed" : "pemesanan.changed",
      );
    }

    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - server terlalu lambat");
    } else if (error.code === "ERR_NETWORK") {
      console.error(
        "Network Error - server backend tidak berjalan atau URL salah. Pastikan: php artisan serve sudah dijalankan di folder krgarage-backend",
      );
    } else if (error.response?.status === 500) {
      console.error("Server error - ada masalah di backend");
    }
    // 401 handling dipindahkan ke axiosSetup.ts
    return Promise.reject(error);
  },
);

const app = createApp(App);
app.use(router);

// Setup axios 401 handler setelah app created tapi sebelum mount
// Di setup ini belum ada toast, hanya redirect logic
import { setupAxiosInterceptors401 } from "./utils/axiosSetup";
setupAxiosInterceptors401(router);

app.mount("#app");
