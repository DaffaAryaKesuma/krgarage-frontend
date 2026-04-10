<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import dayjs from "dayjs";
import { API_URL } from "@/utils/api";
import CustomerServiceSelector from "@/components/customer/bookings/CustomerServiceSelector.vue";
import CustomerVespaSelector from "@/components/customer/bookings/CustomerVespaSelector.vue";
import CustomerSchedulePicker from "@/components/customer/bookings/CustomerSchedulePicker.vue";
import CustomerBookingSummary from "@/components/customer/bookings/CustomerBookingSummary.vue";

interface Vespa {
  id: number;
  model: string;
  plat_nomor: string;
}

interface Service {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan?: number;
  gambar: string;
}

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const router = useRouter();
const toast = useToast();
const token = localStorage.getItem("token");

const myVespas = ref<Vespa[]>([]);
const allServices = ref<Service[]>([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const bookedSlots = ref<string[]>([]);

const form = ref({
  id_vespa: null as number | null,
  service_ids: [] as number[],
  tanggal_pemesanan: "",
  jam_pemesanan: "",
  catatan_pelanggan: "",
});

const errors = ref({
  id_vespa: "",
  service_ids: "",
  tanggal_pemesanan: "",
  jam_pemesanan: "",
});

const touched = ref({
  id_vespa: false,
  service_ids: false,
  tanggal_pemesanan: false,
  jam_pemesanan: false,
});

const selectedServices = computed(() =>
  allServices.value.filter((s) => form.value.service_ids.includes(s.id)),
);

const totalHarga = computed(() =>
  selectedServices.value.reduce((sum, s) => sum + s.harga, 0),
);

const headers = { Authorization: `Bearer ${token}` };

const validateField = (field: keyof typeof errors.value) => {
  if (!touched.value[field]) return;

  if (field === "id_vespa")
    errors.value.id_vespa = form.value.id_vespa ? "" : "Pilih vespa";
  else if (field === "service_ids")
    errors.value.service_ids = form.value.service_ids.length
      ? ""
      : "Pilih minimal 1 layanan";
  else if (field === "tanggal_pemesanan") {
    if (!form.value.tanggal_pemesanan) {
      errors.value.tanggal_pemesanan = "Tanggal pemesanan harus diisi";
      return;
    }

    const selectedDate = dayjs(form.value.tanggal_pemesanan);
    const today = dayjs().startOf("day");

    if (selectedDate.isBefore(today)) {
      errors.value.tanggal_pemesanan = "Tanggal tidak boleh di masa lalu";
    } else {
      errors.value.tanggal_pemesanan = "";
    }
  } else if (field === "jam_pemesanan") {
    if (!form.value.jam_pemesanan || form.value.jam_pemesanan.trim() === "") {
      errors.value.jam_pemesanan = "Jam pemesanan harus dipilih";
    } else if (bookedSlots.value.includes(form.value.jam_pemesanan)) {
      errors.value.jam_pemesanan = "Jam ini sudah dipesan";
    } else {
      errors.value.jam_pemesanan = "";
    }
  }
};

const checkAvailability = async () => {
  if (!form.value.tanggal_pemesanan) return;
  form.value.jam_pemesanan = "";
  try {
    const { data } = await axios.get(
      `${API_URL}/bookings/check-slots?date=${form.value.tanggal_pemesanan}`,
      { headers },
    );
    bookedSlots.value = data;
  } catch (error: any) {
    logError(error, "checkAvailability");
    toast.error(handleApiError(error));
  }
};

const handleServiceChange = (serviceIds: number[]) => {
  form.value.service_ids = serviceIds;
  touched.value.service_ids = true;
  validateField("service_ids");
};

const handleVespaChange = (vespaId: number) => {
  form.value.id_vespa = vespaId;
  touched.value.id_vespa = true;
  validateField("id_vespa");
};

const handleDateChange = () => {
  checkAvailability();
  touched.value.tanggal_pemesanan = true;
  validateField("tanggal_pemesanan");
};

const handleTimeSelect = (_slot: string) => {
  touched.value.jam_pemesanan = true;
  validateField("jam_pemesanan");
};

const submit = async () => {
  // Prevent double submission
  if (isSubmitting.value) return;

  // Validate semua fields
  const fieldsToValidate: (keyof typeof errors.value)[] = [
    "id_vespa",
    "service_ids",
    "tanggal_pemesanan",
    "jam_pemesanan",
  ];

  fieldsToValidate.forEach((field) => {
    touched.value[field] = true;
    validateField(field);
  });

  // Check jika ada error
  if (Object.values(errors.value).some((e) => e)) {
    toast.error("Lengkapi semua field yang wajib");
    return;
  }

  isSubmitting.value = true;

  try {
    const bookingData = {
      id_vespa: Number(form.value.id_vespa),
      service_ids: form.value.service_ids.map((id) => Number(id)),
      tanggal_pemesanan: form.value.tanggal_pemesanan,
      jam_pemesanan: form.value.jam_pemesanan,
      catatan_pelanggan: form.value.catatan_pelanggan || null,
    };

    await axios.post(`${API_URL}/bookings`, bookingData, {
      headers,
    });

    toast.success("Pemesanan berhasil! Silakan datang sesuai jadwal");
    setTimeout(() => router.push("/app/riwayat"), 1500);
  } catch (error: any) {
    logError(error, "submit");
    toast.error(handleApiError(error));
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (!token) return;
  try {
    const [vespas, services] = await Promise.all([
      axios.get(`${API_URL}/my-vespas`, { headers }),
      axios.get(`${API_URL}/services`),
    ]);
    myVespas.value = vespas.data;
    allServices.value = services.data;
  } catch (error: any) {
    logError(error, "onMounted");
    toast.error(handleApiError(error));
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
          >
            <i class="mdi mdi-calendar-check text-3xl"></i>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold mb-2">
              Pemesanan Servis Vespa
            </h1>
            <p class="text-sm sm:text-base text-red-100">
              Pesan layanan dengan mudah
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <i class="mdi mdi-loading animate-spin text-5xl text-red-600"></i>
        <p class="text-gray-600 mt-4">Memuat data layanan...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="space-y-6">
        <!-- STEP 1: Services -->
        <CustomerServiceSelector
          :services="allServices"
          v-model="form.service_ids"
          :error="errors.service_ids"
          :touched="touched.service_ids"
          @update:model-value="handleServiceChange"
        />

        <!-- STEP 2: Vespa -->
        <CustomerVespaSelector
          :vespas="myVespas"
          v-model="form.id_vespa"
          :error="errors.id_vespa"
          :touched="touched.id_vespa"
          @update:model-value="handleVespaChange"
        />

        <!-- STEP 3: Schedule -->
        <CustomerSchedulePicker
          :time-slots="TIME_SLOTS"
          :booked-slots="bookedSlots"
          v-model:date-value="form.tanggal_pemesanan"
          v-model:time-value="form.jam_pemesanan"
          v-model:notes="form.catatan_pelanggan"
          :date-error="errors.tanggal_pemesanan"
          :time-error="errors.jam_pemesanan"
          :date-touched="touched.tanggal_pemesanan"
          :time-touched="touched.jam_pemesanan"
          @date-change="handleDateChange"
          @time-select="handleTimeSelect"
        />

        <!-- Summary & Submit -->
        <CustomerBookingSummary
          :service-count="form.service_ids.length"
          :total-price="totalHarga"
          :selected-date="form.tanggal_pemesanan"
          :selected-time="form.jam_pemesanan"
          :is-submitting="isSubmitting"
        />
      </form>
    </div>
  </div>
</template>
