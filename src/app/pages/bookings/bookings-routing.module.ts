import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';

const routes: Routes = [
  {
    path: '',
    component: BookingListComponent
  },
  {
    path: 'new',
    component: BookingFormComponent,
    data: { mode: 'create' } // Optional: pass data to distinguish create vs edit
  },
  {
    path: ':id',
    component: BookingDetailComponent
  },
  {
    path: ':id/edit',
    component: BookingFormComponent,
    data: { mode: 'edit' } // Optional: pass data to distinguish create vs edit
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule { }
