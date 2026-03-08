<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";

interface Props {
  modelValue: string | number | null;
  options: Array<{ value: string | number; label: string }>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

interface Emits {
  (e: "update:modelValue", value: string | number | null): void;
  (e: "change", value: string | number | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Pilih opsi...",
  disabled: false,
});

const emit = defineEmits<Emits>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected?.label || props.placeholder;
});

const handleSelect = (value: string | number | null) => {
  emit("update:modelValue", value);
  emit("change", value);
  isOpen.value = false;
};

const updateDropdownPosition = () => {
  if (buttonRef.value) {
    const rect = buttonRef.value.getBoundingClientRect();
    dropdownStyle.value = {
      position: "fixed",
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 999999,
    };
  }
};

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      nextTick(() => {
        updateDropdownPosition();
      });
    }
  }
};

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    buttonRef.value &&
    !buttonRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

// Watch isOpen to update position
watch(isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      updateDropdownPosition();
    });
  }
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", updateDropdownPosition, true);
  window.addEventListener("resize", updateDropdownPosition);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", updateDropdownPosition, true);
  window.removeEventListener("resize", updateDropdownPosition);
});
</script>

<template>
  <div class="relative w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <!-- Button -->
    <button
      ref="buttonRef"
      @click.prevent="toggleDropdown"
      :disabled="disabled"
      type="button"
      :class="[
        'w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
        'text-sm sm:text-base',
        disabled
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-white hover:border-gray-400',
        props.class,
      ]"
    >
      <span :class="modelValue === null ? 'text-gray-500' : 'text-gray-900'">
        {{ selectedLabel }}
      </span>
      <i
        :class="[
          'mdi mdi-chevron-down text-lg transition-transform duration-200',
          isOpen ? 'rotate-180' : '',
        ]"
      ></i>
    </button>

    <!-- Dropdown Menu with Teleport -->
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="dropdownRef"
          :style="dropdownStyle"
          class="bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto"
        >
          <div
            v-if="options.length === 0"
            class="px-4 py-3 text-sm text-gray-500"
          >
            Tidak ada data tersedia
          </div>
          <div
            v-for="option in options"
            :key="option.value"
            @click="handleSelect(option.value)"
            :class="[
              'px-4 py-3 cursor-pointer text-sm sm:text-base transition-colors',
              modelValue === option.value
                ? 'bg-red-500 text-white font-medium'
                : 'text-gray-900 hover:bg-gray-100',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
