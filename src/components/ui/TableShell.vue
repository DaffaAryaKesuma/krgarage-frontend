<script setup lang="ts">
import { computed, useSlots } from "vue";
// Class tabel reusable dari utils.
import {
  TABLE_BODY_CLASS,
  TABLE_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_HEADER_CELL_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
} from "@/utils/tableVariants";

// Props untuk mengatur header, class, kolom, dan mode responsive.
interface Props {
  headers: string[];
  wrapperClass?: string;
  tableClass?: string;
  headClass?: string;
  headerRowClass?: string;
  headerCellClass?: string;
  bodyClass?: string;
  columnWidths?: string[];
  responsiveKartu?: boolean;
  desktopBreakpoint?: "md" | "lg" | "xl";
  mobileKartuClass?: string;
}

// Default props membuat TableShell tetap bisa dipakai simpel.
const props = withDefaults(defineProps<Props>(), {
  wrapperClass: "",
  tableClass: TABLE_CLASS,
  headClass: TABLE_HEAD_CLASS,
  headerRowClass: "",
  headerCellClass: TABLE_HEADER_CELL_CLASS,
  bodyClass: TABLE_BODY_CLASS,
  columnWidths: () => [],
  responsiveKartu: false,
  desktopBreakpoint: "md",
  mobileKartuClass: TABLE_MOBILE_KARTU_CLASS,
});

// useSlots dipakai untuk cek apakah parent menyediakan slot mobile.
const slots = useSlots();

// true jika slot mobile ada.
const hasMobileSlot = computed(() => Boolean(slots.mobile));

// Responsive kartu hanya aktif jika props true dan slot mobile tersedia.
const useResponsiveKartu = computed(
  () => props.responsiveKartu && hasMobileSlot.value,
);

// Class untuk menyembunyikan tabel desktop di breakpoint tertentu.
const desktopTableClass = computed(() => {
  if (!useResponsiveKartu.value) return "";
  if (props.desktopBreakpoint === "xl") return "hidden xl:block";
  return props.desktopBreakpoint === "lg"
    ? "hidden lg:block"
    : "hidden md:block";
});

// Class untuk menyembunyikan kartu mobile saat layar sudah desktop.
const mobileKartuVisibilityClass = computed(() => {
  if (props.desktopBreakpoint === "xl") return "xl:hidden";
  if (props.desktopBreakpoint === "lg") return "lg:hidden";
  return "md:hidden";
});

// colgroup hanya dipakai kalau parent mengirim columnWidths.
const hasColumnWidths = computed(() => props.columnWidths.length > 0);
</script>

<template>
  <!-- Wrapper tabel. -->
  <div :class="wrapperClass">
    <!-- Slot mobile tampil jika responsiveKartu aktif. -->
    <div
      v-if="useResponsiveKartu"
      :class="[mobileKartuVisibilityClass, mobileKartuClass]"
    >
      <slot name="mobile" />
    </div>

    <!-- Tabel desktop. -->
    <div :class="desktopTableClass">
      <div class="overflow-x-auto">
        <table :class="tableClass">
          <!-- colgroup mengatur lebar kolom jika dikirim parent. -->
          <colgroup v-if="hasColumnWidths">
            <col
              v-for="(width, index) in columnWidths"
              :key="index"
              :style="{ width }"
            />
          </colgroup>
          <!-- Header tabel. -->
          <thead :class="headClass">
            <tr :class="headerRowClass">
              <th
                v-for="header in headers"
                :key="header"
                :class="headerCellClass"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <!-- Body tabel diisi slot default. -->
          <tbody :class="bodyClass">
            <slot />
          </tbody>
          <!-- Footer tabel opsional. -->
          <slot name="tfoot" />
        </table>
      </div>
    </div>

    <!-- Footer luar tabel opsional, misalnya pagination. -->
    <slot name="footer" />
  </div>
</template>
