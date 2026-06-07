// Mengaktifkan tipe bawaan Vite, termasuk import.meta.env.
/// <reference types="vite/client" />

// Deklarasi ini membuat TypeScript paham file .vue bisa di-import.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Daftar environment variable yang boleh dipakai aplikasi.
interface ImportMetaEnv {
  // Key Pusher untuk realtime notification/refresh.
  readonly VITE_PUSHER_APP_KEY?: string;
  // Cluster Pusher, misalnya ap1.
  readonly VITE_PUSHER_APP_CLUSTER?: string;
}

// Menambahkan tipe env ke import.meta.
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
