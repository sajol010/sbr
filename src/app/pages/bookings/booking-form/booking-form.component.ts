import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';
import { TimeSlot } from '../models/time-slot.model';
import { StaffService } from '../../staff/services/staff.service';
import { CustomerService } from '../../customer/services/customer.service';
import { ServiceService } from '../../../shared/services/service.service'; // Adjusted path
import { Staff } from '../../staff/models/staff.model';
import { Customer } from '../../customer/models/customer.model';
import { Service } from '../../../shared/models/service.model'; // Adjusted path


@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'], // Corrected
  standalone: false, // Ensure part of BookingsModule
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  bookingId: string | number | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  pageTitle: string = 'Create New Booking';

  // Properties for AvailableSlotsComponent inputs
  selectedStaffId: number | string | null = null;
  selectedServiceId: number | string | null = null;
  selectedDate: string | null = null;

  allServices: Service[] = [];
  allStaff: Staff[] = [];
  allCustomers: Customer[] = [];

  dataLoadingStates = {
    services: false,
    staff: false,
    customers: false
  };

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute,
    private staffService: StaffService,
    private customerService: CustomerService,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();
    this.bookingId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.bookingId;
    this.pageTitle = this.isEditMode ? 'Reschedule Booking' : 'Create New Booking';

    this.initForm();

    if (this.isEditMode && this.bookingId) {
      this.loadBookingData(this.bookingId);
    }

    // Listen to changes in form controls that affect available slots
    this.bookingForm.get('staff_id')?.valueChanges.subscribe(val => {
      this.selectedStaffId = val;
    });
    this.bookingForm.get('service_id')?.valueChanges.subscribe(val => {
      this.selectedServiceId = val;
    });
    this.bookingForm.get('booking_date')?.valueChanges.subscribe(val => {
      this.selectedDate = val;
      this.bookingForm.get('start_time')?.reset(); // Reset start time when date changes
    });
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      // For now, using simple number inputs. Replace with dropdowns later.
      service_id: [null, Validators.required],
      staff_id: [null, Validators.required],
      customer_id: [null, Validators.required], // Assuming customer is known or selected
      booking_date: ['', Validators.required],
      start_time: ['', Validators.required], // This will be populated by slot selection
      notes: [''] // Optional
    });

    // If creating, set default date to today or a sensible default
    if (!this.isEditMode) {
      // const today = new Date().toISOString().split('T')[0];
      // this.bookingForm.get('booking_date')?.setValue(today);
      // this.selectedDate = today; // Trigger initial slot load if other fields are set
    }
  }

  loadDropdownData(): void {
    this.dataLoadingStates.services = true;
    this.serviceService.getServices().subscribe({
      next: data => { this.allServices = data; this.dataLoadingStates.services = false; },
      error: err => { console.error('Error loading services', err); this.dataLoadingStates.services = false; this.errorMessage = (this.errorMessage || '') + ' Failed to load services.'; }
    });

    this.dataLoadingStates.staff = true;
    this.staffService.getStaff().subscribe({ // Assuming getStaff() fetches all staff suitable for a dropdown
      next: data => { this.allStaff = data; this.dataLoadingStates.staff = false; },
      error: err => { console.error('Error loading staff', err); this.dataLoadingStates.staff = false; this.errorMessage = (this.errorMessage || '') + ' Failed to load staff.';}
    });

    this.dataLoadingStates.customers = true;
    this.customerService.getCustomers().subscribe({ // Assuming getCustomers() fetches all customers
      next: data => { this.allCustomers = data; this.dataLoadingStates.customers = false; },
      error: err => { console.error('Error loading customers', err); this.dataLoadingStates.customers = false; this.errorMessage = (this.errorMessage || '') + ' Failed to load customers.';}
    });
  }

  loadBookingData(id: string | number): void {
    this.isLoading = true;
    this.bookingService.getBookingById(id).subscribe({
      next: (booking) => {
        this.bookingForm.patchValue({
          service_id: booking.service_id,
          staff_id: booking.staff_id,
          customer_id: booking.customer_id,
          booking_date: booking.booking_date,
          start_time: booking.start_time, // This will be the initially selected slot
          notes: booking.notes
        });
        // Trigger updates for AvailableSlotsComponent
        this.selectedServiceId = booking.service_id;
        this.selectedStaffId = booking.staff_id;
        this.selectedDate = booking.booking_date;

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading booking data:', err);
        this.errorMessage = 'Failed to load booking details.';
        this.isLoading = false;
      }
    });
  }

  onSlotSelected(slot: TimeSlot): void {
    this.bookingForm.get('start_time')?.setValue(slot.start);
    // Optionally, also set end_time if your form/model needs it
    // this.bookingForm.get('end_time')?.setValue(slot.end);
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    const formData = this.bookingForm.value;

    if (this.isEditMode && this.bookingId) {
      // For rescheduling, API expects only booking_date and start_time
      const rescheduleData = {
        booking_date: formData.booking_date,
        start_time: formData.start_time,
        // Include other fields if the API supports updating them during reschedule
      };
      this.bookingService.updateBooking(this.bookingId, rescheduleData).subscribe({
        next: () => this.handleSuccess('Booking rescheduled successfully.'),
        error: (err) => this.handleError(err, 'Failed to reschedule booking.')
      });
    } else {
      // For creating, API expects service_id, staff_id, customer_id, booking_date, start_time
      // Omit notes if it's empty and not desired in payload, or ensure backend handles null/empty
      const createData = {
        service_id: formData.service_id,
        staff_id: formData.staff_id,
        customer_id: formData.customer_id,
        booking_date: formData.booking_date,
        start_time: formData.start_time,
        // notes: formData.notes (only if your createBooking payload in service expects it)
      };
      this.bookingService.createBooking(createData).subscribe({
        next: () => this.handleSuccess('Booking created successfully.'),
        error: (err) => this.handleError(err, 'Failed to create booking.')
      });
    }
  }

  private handleSuccess(message: string): void {
    this.isSubmitting = false;
    // TODO: Show success toast/snackbar
    console.log(message);
    this.router.navigate(['/admin/bookings']); // Navigate to booking list
  }

  private handleError(error: any, defaultMessage: string): void {
    this.isSubmitting = false;
    this.errorMessage = error.error?.message || error.message || defaultMessage;
    console.error(defaultMessage, error);
    // TODO: Show error toast/snackbar
  }

  onCancel(): void {
    this.router.navigate(['/admin/bookings']);
  }
}
