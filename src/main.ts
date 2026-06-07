// createApp adalah fungsi utama untuk membuat aplikasi Vue.
import { createApp } from "vue";
// App.vue adalah komponen root yang pertama kali dirender.
import App from "./App.vue";
// Router mengatur perpindahan halaman.
import router from "./router";
// Axios dipakai untuk request HTTP ke backend.
import axios from "axios";
// Base URL API backend diambil dari helper.
import { API_BASE_URL } from "./utils/api";
// Fungsi ini memberi sinyal ke halaman lain bahwa data penting berubah.
import { notifyKrGarageDataChanged } from "./composables/useRealtimeRefresh";
// CSS global aplikasi.
import "./main.css";
// Icon Material Design Icons.
import "@mdi/font/css/materialdesignicons.css";

// Timeout global axios: request otomatis gagal jika lebih dari 60 detik.
axios.defaults.timeout = 60000; // 60 detik timeout (lebih lama untuk request yang heavy)
// Base URL global agar request axios cukup menulis path endpoint.
axios.defaults.baseURL = API_BASE_URL;

// Request interceptor berjalan sebelum setiap request dikirim.
axios.interceptors.request.use(
  (config) => {
    // Ambil token login dari localStorage.
    const token = localStorage.getItem("token");
    if (token) {
      // Jika token ada, kirim sebagai Bearer token ke backend.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor berjalan setelah backend mengirim response.
axios.interceptors.response.use(
  (response) => {
    // Ambil method dan URL request untuk mengecek apakah request mengubah data.
    const method = response.config.method?.toUpperCase();
    const url = String(response.config.url || "");
    // Mutation berarti request yang biasanya menambah/mengubah/menghapus data.
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method || "");
    // Beberapa endpoint tidak perlu memicu refresh realtime.
    const shouldNotify =
      isMutation &&
      !url.includes("/masuk") &&
      !url.includes("/daftar") &&
      !url.includes("/keluar") &&
      !url.includes("/ping") &&
      !url.includes("/notifikasi/");

    if (shouldNotify) {
      // Beri tahu halaman lain agar data terkait dapat direfresh.
      notifyKrGarageDataChanged(
        url.includes("/notifikasi") ? "notifikasi.changed" : "pemesanan.changed",
      );
    }

    return response;
  },
  (error) => {
    // Pesan console ini membantu debugging saat backend bermasalah.
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

// Buat instance aplikasi Vue dari App.vue.
const app = createApp(App);
// Pasang router agar <router-view> bisa menampilkan halaman.
app.use(router);

// Setup axios 401 handler setelah app created tapi sebelum mount
// Di setup ini belum ada toast, hanya redirect logic
// Import ini diletakkan di bawah karena setup-nya butuh router yang sudah siap.
import { setupAxiosInterceptors401 } from "./utils/axiosSetup";
// Interceptor 401 menangani sesi login yang habis atau token tidak valid.
setupAxiosInterceptors401(router);

// Mount aplikasi ke elemen <div id="app"> di index.html.
app.mount("#app");
