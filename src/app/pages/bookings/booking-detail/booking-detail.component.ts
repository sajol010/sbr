import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css'], // Corrected
  standalone: false, // Ensure part of BookingsModule
})
export class BookingDetailComponent implements OnInit {
  booking: Booking | null = null;
  bookingId: string | number | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookingId = id;
        this.loadBookingDetails(id);
      } else {
        this.errorMessage = 'Booking ID not found in route.';
        // Optionally navigate away or show a more prominent error
      }
    });
  }

  loadBookingDetails(id: string | number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.bookingService.getBookingById(id).subscribe({
      next: (data) => {
        this.booking = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching booking details:', err);
        this.errorMessage = 'Failed to load booking details.';
        if (err.status === 404) {
            this.errorMessage = 'Booking not found.';
        }
        this.isLoading = false;
      }
    });
  }

  rescheduleBooking(): void {
    if (this.bookingId) {
      this.router.navigate(['/admin/bookings', this.bookingId, 'edit']);
    }
  }

  cancelBooking(): void {
    if (!this.bookingId || !this.booking) return;

    // Check if booking is in a cancellable state (e.g., 'confirmed' or 'pending')
    // This logic might be more complex depending on business rules
    const cancellableStates = ['confirmed', 'pending'];
    if (this.booking.status && !cancellableStates.includes(this.booking.status.toLowerCase())) {
        alert(`This booking cannot be cancelled as it is already ${this.booking.status}.`);
        return;
    }


    if (confirm('Are you sure you want to cancel this booking?')) {
      this.isLoading = true; // Indicate activity
      this.bookingService.cancelBooking(this.bookingId).subscribe({
        next: () => {
          this.isLoading = false;
          // TODO: Show success toast/snackbar
          console.log('Booking cancelled successfully from detail view');
          // Option 1: Navigate back to list
          this.router.navigate(['/admin/bookings']);
          // Option 2: Or, just update the status on the current view if preferred
          // if (this.booking) this.booking.status = 'cancelled'; // Or whatever the API returns
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error cancelling booking:', err);
          this.errorMessage = 'Failed to cancel booking. Please try again.';
          // TODO: Show error toast/snackbar
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/bookings']);
  }
}
