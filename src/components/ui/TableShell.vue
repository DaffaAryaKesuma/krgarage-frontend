<script setup lang="ts">
import { computed, useSlots } from "vue";
import {
  TABLE_BODY_CLASS,
  TABLE_CLASS,
  TABLE_HEAD_CLASS,
  TABLE_HEADER_CELL_CLASS,
  TABLE_MOBILE_KARTU_CLASS,
} from "@/utils/tableVariants";

interface Props {
  headers: string[];
  wrapperClass?: string;
  tableClass?: string;
  headClass?: string;
  headerRowClass?: string;
  headerCellClass?: string;
  bodyClass?: string;
  responsiveKartu?: boolean;
  desktopBreakpoint?: "md" | "lg" | "xl";
  mobileKartuClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  wrapperClass: "",
  tableClass: TABLE_CLASS,
  headClass: TABLE_HEAD_CLASS,
  headerRowClass: "",
  headerCellClass: TABLE_HEADER_CELL_CLASS,
  bodyClass: TABLE_BODY_CLASS,
  responsiveKartu: false,
  desktopBreakpoint: "md",
  mobileKartuClass: TABLE_MOBILE_KARTU_CLASS,
});

const slots = useSlots();

const hasMobileSlot = computed(() => Boolean(slots.mobile));

const useResponsiveKartu = computed(
  () => props.responsiveKartu && hasMobileSlot.value,
);

const desktopTableClass = computed(() => {
  if (!useResponsiveKartu.value) return "";
  if (props.desktopBreakpoint === "xl") return "hidden xl:block";
  return props.desktopBreakpoint === "lg"
    ? "hidden lg:block"
    : "hidden md:block";
});

const mobileKartuVisibilityClass = computed(() => {
  if (props.desktopBreakpoint === "xl") return "xl:hidden";
  if (props.desktopBreakpoint === "lg") return "lg:hidden";
  return "md:hidden";
});
</script>

<template>
  <div :class="wrapperClass">
    <div
      v-if="useResponsiveKartu"
      :class="[mobileKartuVisibilityClass, mobileKartuClass]"
    >
      <slot name="mobile" />
    </div>

    <div :class="desktopTableClass">
      <div class="overflow-x-auto">
        <table :class="tableClass">
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
          <tbody :class="bodyClass">
            <slot />
          </tbody>
          <slot name="tfoot" />
        </table>
      </div>
    </div>

    <slot name="footer" />
  </div>
</template>
