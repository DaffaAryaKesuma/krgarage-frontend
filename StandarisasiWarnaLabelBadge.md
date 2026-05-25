# KRGarage Badge, Label, Alert, and Tone Standard

Dokumen ini mencatat standar visual semantik untuk badge, label kecil, chip, alert, rank, icon tone, gradient tone, toast tone, tombol aksi, dan tabel.

Implementasi utama ada di:

```txt
src/utils/badgeVariants.ts
src/utils/buttonVariants.ts
src/utils/tableVariants.ts
src/components/ui/TableShell.vue
```

Status pemesanan tetap melalui:

```txt
src/utils/statusBadge.ts
src/utils/statusCore.ts
src/utils/statusRules.ts
```

Status pembayaran tetap melalui:

```txt
src/utils/pembayaranStatus.ts
```

## Prinsip

- Gunakan helper pusat untuk visual yang membawa makna: status, pembayaran, role, stok, chip metadata, alert/info box, rank, icon tone, toast tone, tombol aksi, dan tabel.
- Jangan masukkan tombol, form input, focus ring, tab, dekorasi, dan brand action ke `badgeVariants.ts`.
- Tombol aksi distandarisasi melalui `buttonVariants.ts`.
- Form input, focus ring, label, textarea, select, error state, dan hint text distandarisasi melalui `formVariants.ts`.

## Helper Utama

| Helper | Kegunaan |
| ------ | -------- |
| `buildBadgeClass()` | Membungkus variant badge dengan base class |
| `getRoleBadgeClass()` | Badge role admin, pemilik, mekanik, pelanggan |
| `getInventoryBadgeClass()` | Badge stok habis, kritis, aman |
| `getChipBadgeClass()` | Chip kecil non-status seperti kategori, plat nomor, jumlah |
| `getRankBadgeClass()` | Badge ranking angka |
| `getIconToneClass()` | Background dan warna icon tone |
| `getToneTextClass()` | Warna teks/icon saja |
| `getGradientToneClass()` | Gradient header/modal semantic |
| `getSolidToneClass()` | Solid tone untuk toast atau surface solid |
| `getSoftHoverToneClass()` | Hover lembut per tone |
| `getAlertBoxClass()` | Alert/info box semantic |
| `getAlertIconClass()` | Warna icon untuk alert/info box |

## Base Class

Badge:

```txt
inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium
```

Label metadata:

```txt
text-[11px] font-medium uppercase tracking-wide text-gray-500
```

Alert box:

```txt
rounded-xl border p-4 shadow-sm
```

## Status Badge

| Status | Variant |
| ------ | ------- |
| Menunggu | `badgeVariants.status.menunggu` |
| Dikonfirmasi | `badgeVariants.status.dikonfirmasi` |
| Dikerjakan | `badgeVariants.status.dikerjakan` |
| Selesai | `badgeVariants.status.selesai` |
| Batal | `badgeVariants.status.batal` |

Pemakaian komponen jangan mengambil variant langsung. Pakai:

```ts
getStatusBadgeClass(status)
getStatusLabel(status)
getStatusIcon(status)
```

## Payment Badge

| Status | Variant |
| ------ | ------- |
| Lunas | `badgeVariants.payment.lunas` |
| Belum Lunas | `badgeVariants.payment.belumLunas` |

Pemakaian:

```ts
getPembayaranStatusBadgeClass(status)
getPembayaranStatusLabel(status)
```

## Inventory Badge

| Status | Helper |
| ------ | ------ |
| Habis | `getInventoryBadgeClass("habis")` |
| Kritis | `getInventoryBadgeClass("kritis")` |
| Aman | `getInventoryBadgeClass("aman")` |

## Role Badge

| Role | Helper |
| ---- | ------ |
| Admin | `getRoleBadgeClass("admin")` |
| Pemilik | `getRoleBadgeClass("pemilik")` |
| Mekanik | `getRoleBadgeClass("mekanik")` |
| Pelanggan | `getRoleBadgeClass("pelanggan")` |

## Chip Variants

Chip dipakai untuk metadata kecil yang bukan status utama.

| Variant | Contoh pemakaian |
| ------- | ---------------- |
| `primary` | chip brand/aksi utama |
| `neutral` | kategori, plat nomor, jumlah |
| `info` | informasi umum |
| `success` | nilai positif |
| `warning` | perhatian |
| `danger` | risiko/error ringan |

Pemakaian:

```ts
getChipBadgeClass("neutral")
```

## Alert Box

| Variant | Makna |
| ------- | ----- |
| `success` | berhasil, selesai, catatan mekanik positif |
| `warning` | peringatan, stok/jadwal perlu perhatian |
| `error` | error, batal, gagal |
| `info` | informasi umum |
| `neutral` | catatan atau informasi netral |

Pemakaian:

```ts
getAlertBoxClass("warning")
getAlertIconClass("warning")
```

## Tone Variants

Tone dipakai untuk icon, teks, gradient, hover, dan surface solid.

| Tone | Makna |
| ---- | ----- |
| `primary` | brand merah KRGarage |
| `info` | informasi biru |
| `success` | berhasil/hijau |
| `emerald` | sukses alternatif untuk status selesai |
| `warning` | amber/perhatian |
| `danger` | merah/error |
| `owner` | ungu/pemilik |
| `neutral` | abu-abu/netral |

Pemakaian:

```ts
getIconToneClass("info")
getToneTextClass("success")
getGradientToneClass("danger")
getSolidToneClass("warning")
getSoftHoverToneClass("neutral")
```

## Button Standard

Tombol distandarisasi terpisah dari badge karena tombol adalah kontrol aksi, bukan penanda status.

Implementasi utama:

```txt
src/utils/buttonVariants.ts
```

Helper tombol:

| Helper/Const | Kegunaan |
| ------------ | -------- |
| `getButtonClass()` | tombol aksi biasa dengan variant dan size |
| `getFullWidthButtonClass()` | tombol aksi full width, umum untuk panel/card mobile |
| `getIconButtonClass()` | tombol icon-only seperti edit, hapus, restock |
| `BUTTON_BASE_CLASS` | base class tombol teks |
| `ICON_BUTTON_BASE_CLASS` | base class tombol icon-only |

Variant tombol teks:

| Variant | Makna |
| ------- | ----- |
| `primary` | aksi utama brand merah |
| `secondary` | aksi sekunder/netral |
| `danger` | aksi destruktif solid |
| `dangerOutline` | aksi destruktif outline |
| `warning` | aksi perhatian solid |
| `warningOutline` | aksi perhatian outline |
| `success` | aksi berhasil/selesai solid |
| `successOutline` | aksi berhasil/selesai outline |
| `info` | aksi informasi solid |
| `infoOutline` | aksi informasi outline |
| `neutralOutline` | aksi netral outline kontras |
| `ghost` | aksi ringan tanpa border |
| `link` | aksi bergaya tautan |

Variant tombol icon:

| Variant | Makna |
| ------- | ----- |
| `neutral` | icon action umum |
| `primary` | icon action brand |
| `info` | lihat/detail/edit informasi |
| `success` | restock/selesai/positif |
| `danger` | hapus/batal/destruktif |
| `subtle` | action kecil yang low emphasis |

Aturan pemakaian:

- Pakai `getButtonClass()` untuk tombol modal, submit, dan action biasa.
- Pakai `getFullWidthButtonClass()` untuk tombol yang memenuhi lebar parent, terutama panel aksi dan mobile card.
- Pakai `getIconButtonClass()` untuk tombol icon-only.
- Close button, stepper quantity, tab, pagination, dan kontrol khusus boleh tetap punya style lokal sampai distandarisasi di tahap berikutnya.
- Jangan gunakan `badgeVariants.ts` untuk styling tombol.

## Arsitektur File

`badgeVariants.ts` hanya menyimpan visual primitives dan helper class.

`statusCore.ts` menyimpan status canonical, mapping status, filter option, dan normalisasi status.

`statusRules.ts` menyimpan aturan bisnis status, seperti apakah pemesanan bisa dibatalkan atau diselesaikan.

`statusBadge.ts` menjadi public export untuk status pemesanan.

`pembayaranStatus.ts` menyimpan status dan helper pembayaran.

## Catatan Status Batal

Backend memakai status:

```txt
Batal
```

Frontend menormalisasi perbandingan status dengan lowercase, sehingga input `batal` dan `Batal` tetap aman. Nilai canonical frontend mengikuti `Batal`.

## Yang Tidak Masuk Standar Ini

Jangan pakai `badgeVariants.ts` untuk:

- tombol `Tambah`, `Edit`, `Hapus`, `Simpan`
- form label biasa seperti `Nama`, `Email`, `Harga`
- input border, invalid state, placeholder, dan focus ring
- layout card biasa
- dekorasi hero/background
- tab aktif/nonaktif
- brand CTA solid yang bukan badge/alert/tone semantic

Jika area itu ingin distandarisasi, buat tahap lanjutan dengan file khusus:

```txt
src/utils/formVariants.ts
```

## Table Standard

Tabel distandarisasi terpisah dari badge karena tabel adalah struktur layout data, bukan status visual.

Implementasi utama:

```txt
src/utils/tableVariants.ts
src/components/ui/TableShell.vue
```

Helper tabel:

| Helper/Const | Kegunaan |
| ------------ | -------- |
| `TABLE_WRAPPER_CLASS` | wrapper tabel standar dengan border, radius, surface putih, shadow |
| `TABLE_CLASS` | table dasar full width dengan divider |
| `TABLE_FIXED_CLASS` | table fixed-layout untuk kolom stabil |
| `TABLE_HEAD_CLASS` | background header tabel |
| `TABLE_HEADER_CELL_CLASS` | header cell compact standar |
| `TABLE_COMFORTABLE_HEADER_CELL_CLASS` | header cell lebih lega untuk tabel keuangan/laporan |
| `TABLE_BODY_CLASS` | body table dengan divider dan surface putih |
| `TABLE_MOBILE_KARTU_CLASS` | container kartu mobile responsive table |
| `TABLE_MOBILE_CARD_CLASS` | kartu mobile untuk item table |
| `TABLE_MOBILE_CARD_HEADER_CLASS` | header kartu mobile tanpa divider |
| `TABLE_MOBILE_CARD_DIVIDER_HEADER_CLASS` | header kartu mobile dengan divider bawah |
| `TABLE_MOBILE_CARD_GRID_CLASS` | grid metadata 2 kolom di kartu mobile |
| `TABLE_MOBILE_CARD_SINGLE_GRID_CLASS` | grid metadata responsive 1 ke 2 kolom |
| `TABLE_MOBILE_CARD_STACK_CLASS` | stack metadata vertikal di kartu mobile |
| `TABLE_MOBILE_CARD_FOOTER_CLASS` | footer kartu mobile dengan divider atas |
| `TABLE_ROW_HOVER_CLASS` | hover row netral |
| `TABLE_DANGER_ROW_HOVER_CLASS` | hover row untuk tabel perhatian/low stock |
| `buildTableClass()` | table class dengan tambahan class khusus |
| `buildFixedTableClass()` | fixed table class dengan tambahan class khusus |
| `buildTableHeaderCellClass()` | header cell standar dengan tambahan width/warna khusus |
| `buildComfortableTableHeaderCellClass()` | header cell lega dengan tambahan khusus |

Aturan pemakaian:

- Pakai `TableShell` untuk tabel yang punya desktop table dan/atau mobile card.
- Pakai `tableVariants.ts` untuk wrapper, head, body, header cell, mobile card, dan hover row.
- Pakai mobile card variants untuk struktur kartu responsive table: card, header, grid, stack, dan footer.
- Width kolom tetap boleh spesifik per tabel melalui `buildTableHeaderCellClass(...)`.
- Jangan masukkan badge status, payment, role, atau stok ke `tableVariants.ts`; tetap gunakan helper badge/status masing-masing.

## Form Standard

Form input, label, textarea, select, error state, hint text, dan focus ring distandarisasi terpisah dari badge dan tombol.

Implementasi utama:

```txt
src/utils/formVariants.ts
```

Helper form:

| Helper/Const | Kegunaan |
| ------------ | -------- |
| `FORM_LABEL_CLASS` | Label standar untuk field form |
| `FORM_REQUIRED_MARK_CLASS` | Warna tanda wajib (*) merah |
| `FORM_HINT_CLASS` | Teks petunjuk/hint di bawah field |
| `FORM_ERROR_CLASS` | Teks pesan error di bawah field |
| `FORM_INPUT_BASE_CLASS` | Base class input (layout, radius, transisi) |
| `FORM_INPUT_NORMAL_CLASS` | State normal dengan hover dan focus merah brand |
| `FORM_INPUT_ERROR_CLASS` | State error (border merah, bg merah muda) |
| `getFormInputClass()` | Helper gabungan input normal/error |
| `FORM_TEXTAREA_BASE_CLASS` | Base class textarea (sama dengan input + resize-none) |
| `getFormTextareaClass()` | Helper gabungan textarea normal/error |
| `FORM_SELECT_BASE_CLASS` | Base class native `<select>` |
| `getFormSelectClass()` | Helper gabungan select normal/error |
| `FORM_INPUT_ICON_WRAPPER_CLASS` | Wrapper `relative group` untuk input dengan icon prefix |
| `FORM_INPUT_ICON_PREFIX_CLASS` | Posisi absolut icon prefix kiri |
| `getFormInputWithIconClass()` | Input dengan padding kiri untuk icon prefix |

Focus ring standar: **`focus:ring-2 focus:ring-red-200`** (merah brand, ring tipis).

Aturan pemakaian:

- Pakai `getFormInputClass(hasError?)` untuk semua `<input>` di modal dan form.
- Pakai `getFormTextareaClass(hasError?)` untuk semua `<textarea>`.
- Pakai `getFormSelectClass(hasError?)` untuk native `<select>`.
- Pakai `FORM_LABEL_CLASS` untuk semua `<label>` field form standar.
- Pakai `FORM_ERROR_CLASS` untuk `<p>` pesan error di bawah field.
- Pakai `FORM_HINT_CLASS` untuk `<p>` petunjuk/hint di bawah field.
- `CustomSelect.vue` pakai `FORM_LABEL_CLASS` untuk label-nya.
- Jangan gunakan `badgeVariants.ts`, `buttonVariants.ts`, atau `tableVariants.ts` untuk styling form.
