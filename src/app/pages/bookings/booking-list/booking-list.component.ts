import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'], // Corrected
  standalone: false, // Ensure part of BookingsModule
})
export class BookingListComponent implements OnInit {
  upcomingBookings: Booking[] = [];
  pastBookings: Booking[] = [];

  isLoadingUpcoming: boolean = false;
  isLoadingPast: boolean = false;

  errorUpcoming: string | null = null;
  errorPast: string | null = null;

  activeTab: 'upcoming' | 'past' = 'upcoming';

  // TODO: Add properties for filter inputs (customer_id, staff_id, date_from, date_to)
  // and a method to apply filters and reload data.

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUpcomingBookings();
    this.loadPastBookings();
  }

  loadUpcomingBookings(): void {
    this.isLoadingUpcoming = true;
    this.errorUpcoming = null;
    // const queryParams = { ... }; // TODO: Collect from filter inputs
    this.bookingService.getBookings('upcoming' /*, queryParams */).subscribe({
      next: (bookings) => {
        this.upcomingBookings = bookings;
        this.isLoadingUpcoming = false;
      },
      error: (err) => {
        console.error('Error fetching upcoming bookings:', err);
        this.errorUpcoming = 'Failed to load upcoming bookings.';
        this.isLoadingUpcoming = false;
      }
    });
  }

  loadPastBookings(): void {
    this.isLoadingPast = true;
    this.errorPast = null;
    // const queryParams = { ... }; // TODO: Collect from filter inputs
    this.bookingService.getBookings('past' /*, queryParams */).subscribe({
      next: (bookings) => {
        this.pastBookings = bookings;
        this.isLoadingPast = false;
      },
      error: (err) => {
        console.error('Error fetching past bookings:', err);
        this.errorPast = 'Failed to load past bookings.';
        this.isLoadingPast = false;
      }
    });
  }

  selectTab(tab: 'upcoming' | 'past'): void {
    this.activeTab = tab;
    // Data is pre-loaded, could add a refresh if needed when tab is clicked
  }

  navigateToCreateBooking(): void {
    this.router.navigate(['/admin/bookings/new']);
  }

  viewBookingDetails(bookingId: string | number | undefined): void {
    if (bookingId) {
      this.router.navigate(['/admin/bookings', bookingId]);
    }
  }

  rescheduleBooking(bookingId: string | number | undefined): void {
     if (bookingId) {
      this.router.navigate(['/admin/bookings', bookingId, 'edit']);
    }
  }

  cancelBooking(bookingId: string | number | undefined): void {
    if (!bookingId) return;

    if (confirm('Are you sure you want to cancel this booking?')) {
      // Determine which list to update based on activeTab or booking properties
      const isUpcoming = this.upcomingBookings.some(b => b.id === bookingId);

      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          // TODO: Show success toast/snackbar
          console.log('Booking cancelled successfully');
          if (isUpcoming) {
            this.upcomingBookings = this.upcomingBookings.filter(b => b.id !== bookingId);
          } else {
            this.pastBookings = this.pastBookings.filter(b => b.id !== bookingId);
          }
          // Potentially move from upcoming to past (if status changes) or just refresh
        },
        error: (err) => {
          console.error('Error cancelling booking:', err);
          // TODO: Show error toast/snackbar
          alert('Failed to cancel booking.');
        }
      });
    }
  }
}
