import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Staff } from '../models/staff.model';
import { StaffService } from '../services/staff.service';
import { CommonModule } from '@angular/common'; // Required for *ngFor, *ngIf, etc.
import { RouterModule } from '@angular/router'; // Required for routerLink

@Component({
  selector: 'app-staff-list',
  standalone: false, // Will be part of StaffModule
  // Remove standalone: true if StaffModule declares and exports this component
  // imports: [CommonModule, RouterModule], // Needed if standalone: true
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent implements OnInit {
  staffList: Staff[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private staffService: StaffService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.staffService.getStaff().subscribe({
      next: (data) => {
        this.staffList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching staff:', err);
        this.errorMessage = 'Failed to load staff. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  navigateToAddStaff(): void {
    this.router.navigate(['/staff/add']); // Ensure this route is correctly defined
  }

  navigateToEditStaff(id: string | number | undefined): void {
    if (id === undefined) {
      console.error('Cannot navigate to edit: Staff ID is undefined');
      return;
    }
    this.router.navigate(['/staff/edit', id]); // Ensure this route is correctly defined
  }

  deleteStaff(id: string | number | undefined): void {
    if (id === undefined) {
      console.error('Cannot delete: Staff ID is undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => {
          // Refresh the list after deletion
          this.staffList = this.staffList.filter(staff => staff.id !== id);
          // Or call this.loadStaff(); if you prefer to refetch from server
        },
        error: (err) => {
          console.error('Error deleting staff:', err);
          this.errorMessage = 'Failed to delete staff member. Please try again.';
          // Potentially show a toastr notification here
        }
      });
    }
  }
}
