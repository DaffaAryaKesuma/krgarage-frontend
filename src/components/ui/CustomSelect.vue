<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
// Class form select dan label.
import { FORM_LABEL_CLASS, getFormSelectClass } from "@/utils/formVariants";

// Props untuk custom dropdown/select.
interface Props {
  modelValue: string | number | null;
  options: Array<{ value: string | number; label: string }>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  truncateSelectedLabel?: boolean;
  class?: string;
}

// Event update:modelValue membuat komponen bisa dipakai dengan v-model.
interface Emits {
  (e: "update:modelValue", value: string | number | null): void;
  (e: "change", value: string | number | null): void;
}

// Default konfigurasi select.
const props = withDefaults(defineProps<Props>(), {
  placeholder: "Pilih opsi...",
  disabled: false,
  truncateSelectedLabel: true,
});

const emit = defineEmits<Emits>();

// State buka/tutup dropdown.
const isOpen = ref(false);
// Ref DOM dropdown dan tombol untuk hitung posisi.
const dropdownRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
// Style posisi dropdown saat di-teleport ke body.
const dropdownStyle = ref({});

// Label yang tampil di tombol select.
const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected?.label || props.placeholder;
});

// Saat opsi dipilih, update v-model, kirim change, lalu tutup dropdown.
const handleSelect = (value: string | number | null) => {
  emit("update:modelValue", value);
  emit("change", value);
  isOpen.value = false;
};

// Mengatur posisi dropdown agar tetap tepat di bawah tombol.
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

// Toggle dropdown jika tidak disabled.
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

// Menutup dropdown saat user klik di luar tombol/dropdown.
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

// Saat dropdown terbuka, hitung ulang posisi setelah DOM selesai render.
watch(isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      updateDropdownPosition();
    });
  }
});

// Pasang listener klik luar, scroll, dan resize.
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", updateDropdownPosition, true);
  window.addEventListener("resize", updateDropdownPosition);
});

// Lepas listener agar tidak memory leak.
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", updateDropdownPosition, true);
  window.removeEventListener("resize", updateDropdownPosition);
});
</script>

<template>
  <!-- Wrapper select custom. -->
  <div class="relative w-full">
    <!-- Label opsional. -->
    <label v-if="label" :class="FORM_LABEL_CLASS">
      {{ label }}
    </label>

    <!-- Tombol utama select. -->
    <button
      ref="buttonRef"
      @click.prevent="toggleDropdown"
      :disabled="disabled"
      type="button"
      :class="[
        getFormSelectClass(false, 'flex min-w-0 items-center justify-between px-4 py-2 text-left sm:text-base'),
        props.class,
      ]"
    >
      <!-- Label terpilih, bisa truncate atau tidak. -->
      <span
        :class="[
          'block min-w-0 flex-1 pr-2 capitalize',
          props.truncateSelectedLabel ? 'truncate' : 'whitespace-nowrap',
          modelValue === null ? 'text-gray-500' : 'text-gray-900',
        ]"
      >
        {{ selectedLabel }}
      </span>
      <!-- Icon panah berputar saat dropdown terbuka. -->
      <i
        :class="[
          'mdi mdi-chevron-down shrink-0 text-lg transition-transform duration-200',
          isOpen ? 'rotate-180' : '',
        ]"
      ></i>
    </button>

    <!-- Teleport membuat dropdown dirender di body supaya tidak terpotong parent. -->
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
          <!-- Empty option list. -->
          <div
            v-if="options.length === 0"
            class="px-4 py-3 text-sm text-gray-500"
          >
            Tidak ada data tersedia
          </div>
          <!-- Daftar opsi. -->
          <div
            v-for="option in options"
            :key="option.value"
            @click="handleSelect(option.value)"
            :class="[
              'px-4 py-3 cursor-pointer text-sm sm:text-base transition-colors capitalize',
              modelValue === option.value
                ? 'bg-red-600 text-white font-medium'
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
