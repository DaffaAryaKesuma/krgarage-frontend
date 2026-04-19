import type { Booking } from "@/types/booking";
import type { BookingStatusFilter } from "@/utils/statusBadge";
import type { PaymentStatusFilter } from "@/utils/paymentStatus";
import { matchesBookingStatusFilter } from "@/utils/statusBadge";
import { matchesPaymentStatusFilter } from "@/utils/paymentStatus";

export interface AdminBookingsFilterState {
  query: string;
  monthFilter: string;
  yearFilter: string;
  statusFilter: BookingStatusFilter;
  paymentFilter: PaymentStatusFilter;
  todayOnly: boolean;
}

export function matchesAdminBookingFilters(
  booking: Booking,
  filters: AdminBookingsFilterState,
): boolean {
  if (!matchesBookingStatusFilter(booking.status, filters.statusFilter)) {
    return false;
  }

  if (
    !matchesPaymentStatusFilter(
      booking.status_pembayaran,
      filters.paymentFilter,
    )
  ) {
    return false;
  }

  if (filters.monthFilter || filters.yearFilter) {
    const bookingDate = new Date(booking.tanggal_pemesanan);
    const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, "0");
    const bookingYear = bookingDate.getFullYear().toString();

    if (filters.monthFilter && bookingMonth !== filters.monthFilter) {
      return false;
    }

    if (filters.yearFilter && bookingYear !== filters.yearFilter) {
      return false;
    }
  }

  if (filters.todayOnly) {
    const today = new Date().toISOString().split("T")[0];
    const bookingDate = booking.tanggal_pemesanan.split("T")[0];

    if (bookingDate !== today) {
      return false;
    }
  }

  const normalizedQuery = filters.query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return (
    booking.pengguna?.nama.toLowerCase().includes(normalizedQuery) ||
    booking.vespa?.model.toLowerCase().includes(normalizedQuery) ||
    booking.vespa?.plat_nomor.toLowerCase().includes(normalizedQuery)
  );
}
