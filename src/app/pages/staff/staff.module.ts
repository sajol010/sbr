import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { StaffRoutingModule } from './staff-routing.module';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffAddComponent } from './staff-add/staff-add.component';
import { StaffEditComponent } from './staff-edit/staff-edit.component';


@NgModule({
  declarations: [
    StaffListComponent,
    StaffAddComponent,
    StaffEditComponent
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    ReactiveFormsModule // Add ReactiveFormsModule here
  ],
  exports: [
    StaffListComponent,
    StaffAddComponent,
    StaffEditComponent
    // No need to export ReactiveFormsModule itself, just import it for use in this module's components
  ]
})
export class StaffModule { }
