import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AvailableSlotsComponent } from './available-slots/available-slots.component';


@NgModule({
  declarations: [
    BookingListComponent,
    BookingFormComponent,
    BookingDetailComponent,
    AvailableSlotsComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    ReactiveFormsModule // Added for BookingFormComponent
  ],
  exports: [
    BookingListComponent,
    BookingFormComponent,
    BookingDetailComponent,
    AvailableSlotsComponent
  ]
})
export class BookingsModule { }
