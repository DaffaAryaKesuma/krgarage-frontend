# KRGarage Badge & Alert Design System

## Base Theme

| Token         | Color     |
| ------------- | --------- |
| Primary       | `#B91C1C` |
| Primary Hover | `#991B1B` |
| Primary Soft  | `#FEE2E2` |
| White         | `#FFFFFF` |
| Surface       | `#F9FAFB` |
| Text Dark     | `#111827` |

---

# Status Badge

## Menunggu

| Property   | Color     |
| ---------- | --------- |
| Background | `#F3F4F6` |
| Text       | `#4B5563` |
| Border     | `#D1D5DB` |

---

## Dikonfirmasi

| Property   | Color     |
| ---------- | --------- |
| Background | `#DBEAFE` |
| Text       | `#1D4ED8` |
| Border     | `#93C5FD` |

---

## Dikerjakan

| Property   | Color     |
| ---------- | --------- |
| Background | `#FEF3C7` |
| Text       | `#B45309` |
| Border     | `#FCD34D` |

---

## Selesai

| Property   | Color     |
| ---------- | --------- |
| Background | `#D1FAE5` |
| Text       | `#047857` |
| Border     | `#6EE7B7` |

---

## Batal

| Property   | Color     |
| ---------- | --------- |
| Background | `#FEE2E2` |
| Text       | `#B91C1C` |
| Border     | `#FCA5A5` |

---

# Payment Badge

## Lunas

| Property   | Color     |
| ---------- | --------- |
| Background | `#DCFCE7` |
| Text       | `#166534` |
| Border     | `#86EFAC` |

---

## Belum Lunas

| Property   | Color     |
| ---------- | --------- |
| Background | `#F3F4F6` |
| Text       | `#4B5563` |
| Border     | `#D1D5DB` |

---

# Inventory Badge

## Habis

| Property   | Color     |
| ---------- | --------- |
| Background | `#FEE2E2` |
| Text       | `#991B1B` |
| Border     | `#FCA5A5` |

---

## Kritis

| Property   | Color     |
| ---------- | --------- |
| Background | `#FEF3C7` |
| Text       | `#B45309` |
| Border     | `#FCD34D` |

---

## Aman

| Property   | Color     |
| ---------- | --------- |
| Background | `#DCFCE7` |
| Text       | `#166534` |
| Border     | `#86EFAC` |

---

# Role Badge

## Admin

| Property   | Color     |
| ---------- | --------- |
| Background | `#FEE2E2` |
| Text       | `#B91C1C` |
| Border     | `#FCA5A5` |

---

## Pemilik

| Property   | Color     |
| ---------- | --------- |
| Background | `#F3E8FF` |
| Text       | `#7E22CE` |
| Border     | `#D8B4FE` |

---

## Mekanik

| Property   | Color     |
| ---------- | --------- |
| Background | `#E0F2FE` |
| Text       | `#0369A1` |
| Border     | `#7DD3FC` |

---

## Pelanggan

| Property   | Color     |
| ---------- | --------- |
| Background | `#F3F4F6` |
| Text       | `#4B5563` |
| Border     | `#D1D5DB` |

---

# Alert Box

## Success Alert

| Property   | Color     |
| ---------- | --------- |
| Background | `#ECFDF5` |
| Border     | `#6EE7B7` |
| Text       | `#065F46` |

---

## Warning Alert

| Property   | Color     |
| ---------- | --------- |
| Background | `#FFFBEB` |
| Border     | `#FCD34D` |
| Text       | `#92400E` |

---

## Error Alert

| Property   | Color     |
| ---------- | --------- |
| Background | `#FEF2F2` |
| Border     | `#FCA5A5` |
| Text       | `#991B1B` |

---

## Info Alert

| Property   | Color     |
| ---------- | --------- |
| Background | `#EFF6FF` |
| Border     | `#93C5FD` |
| Text       | `#1D4ED8` |

---

# Badge Style Guideline

```css
rounded-full
border
px-2.5
py-1
text-xs
font-medium
```

---

# Alert Box Style Guideline

```css
rounded-xl
border
p-4
shadow-sm
```

---

# Recommended Architecture

## Create Shared Badge Variants

File:

```txt
src/utils/badgeVariants.ts
```

Example:

```ts
export const badgeVariants = {
  pending: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-300",
  },

  confirmed: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },

  working: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },

  success: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },

  danger: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
}
```

---

# Important Fix

## Normalize `Batal` Status

Frontend:

```ts
BATAL: "batal"
```

Backend:

```php
STATUS_BATAL = 'Batal'
```

Recommendation:

* use one standard only
* recommended:

  * `Batal`
* normalize using lowercase before comparison
* update `getStatusBadge()`
* update `getStatusLabel()`
* update API transformer if needed
