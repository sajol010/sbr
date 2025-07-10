import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { TimeSlot } from '../models/time-slot.model';
import { AvailableSlotsParams } from '../models/available-slots-params.model';

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css'], // Corrected to styleUrls
  standalone: false, // Ensure it's not standalone if part of BookingsModule
})
export class AvailableSlotsComponent implements OnChanges {
  @Input() staffId: number | string | null = null;
  @Input() serviceId: number | string | null = null;
  @Input() date: string | null = null; // Expected format YYYY-MM-DD

  @Output() slotSelected = new EventEmitter<TimeSlot>();

  availableSlots: TimeSlot[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  noSlotsMessage: string | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Check if any of the relevant inputs have changed and are valid
    if ((changes['staffId'] || changes['serviceId'] || changes['date'])) {
        this.fetchSlots();
    }
  }

  fetchSlots(): void {
    if (this.staffId && this.serviceId && this.date) {
      this.isLoading = true;
      this.errorMessage = null;
      this.noSlotsMessage = null;
      this.availableSlots = []; // Clear previous slots

      const params: AvailableSlotsParams = {
        staff_id: this.staffId,
        service_id: this.serviceId,
        date: this.date,
      };

      this.bookingService.getAvailableSlots(params).subscribe({
        next: (slots) => {
          this.availableSlots = slots;
          if (slots.length === 0) {
            this.noSlotsMessage = 'No available slots for the selected criteria.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching available slots:', err);
          this.errorMessage = 'Failed to load available slots.';
          this.isLoading = false;
        },
      });
    } else {
      this.availableSlots = []; // Clear slots if inputs are incomplete
      this.noSlotsMessage = 'Please select a staff, service, and date to see available slots.';
    }
  }

  onSlotSelect(slot: TimeSlot): void {
    this.slotSelected.emit(slot);
  }
}
