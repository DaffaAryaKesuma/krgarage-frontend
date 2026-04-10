<script setup lang="ts">
import { computed, useSlots } from "vue";

interface Props {
  headers: string[];
  wrapperClass?: string;
  tableClass?: string;
  headClass?: string;
  headerRowClass?: string;
  headerCellClass?: string;
  bodyClass?: string;
  responsiveCards?: boolean;
  desktopBreakpoint?: "md" | "lg";
  mobileCardsClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  wrapperClass: "",
  tableClass: "w-full",
  headClass: "",
  headerRowClass: "",
  headerCellClass:
    "px-6 py-3 text-xs text-left font-medium text-gray-500 uppercase tracking-wider",
  bodyClass: "bg-white divide-y divide-gray-200",
  responsiveCards: false,
  desktopBreakpoint: "md",
  mobileCardsClass: "space-y-4 p-4",
});

const slots = useSlots();

const hasMobileSlot = computed(() => Boolean(slots.mobile));

const useResponsiveCards = computed(
  () => props.responsiveCards && hasMobileSlot.value,
);

const desktopTableClass = computed(() => {
  if (!useResponsiveCards.value) return "";
  return props.desktopBreakpoint === "lg"
    ? "hidden lg:block"
    : "hidden md:block";
});

const mobileCardsVisibilityClass = computed(() => {
  if (props.desktopBreakpoint === "lg") return "lg:hidden";
  return "md:hidden";
});
</script>

<template>
  <div :class="wrapperClass">
    <div
      v-if="useResponsiveCards"
      :class="[mobileCardsVisibilityClass, mobileCardsClass]"
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
