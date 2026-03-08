import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "./main.css";
import "@mdi/font/css/materialdesignicons.css";

// Configure axios defaults untuk improve performance awareness
axios.defaults.timeout = 60000; // 60 detik timeout (lebih lama untuk request yang heavy)
axios.defaults.baseURL = "http://127.0.0.1:8000";

// Add request interceptor untuk show loading state
axios.interceptors.request.use(
  (config) => {
    // Bisa tambahkan global loading indicator di sini jika perlu
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor untuk handle errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - server terlalu lambat");
    } else if (error.code === "ERR_NETWORK") {
      console.error(
        "Network Error - server backend tidak berjalan atau URL salah. Pastikan: php artisan serve sudah dijalankan di folder krgarage-backend"
      );
    } else if (error.response?.status === 500) {
      console.error("Server error - ada masalah di backend");
    }
    // 401 handling dipindahkan ke axiosSetup.ts
    return Promise.reject(error);
  }
);

const app = createApp(App);
app.use(router);

// Setup axios 401 handler setelah app created tapi sebelum mount
// Di setup ini belum ada toast, hanya redirect logic
import { setupAxiosInterceptors401 } from "./utils/axiosSetup";
setupAxiosInterceptors401(router, app);

app.mount("#app");
