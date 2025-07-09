import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../services/staff.service';
import { Staff } from '../models/staff.model';

@Component({
  selector: 'app-staff-edit',
  standalone: false, // Will be part of StaffModule
  templateUrl: './staff-edit.component.html',
  styleUrl: './staff-edit.component.css'
})
export class StaffEditComponent implements OnInit {
  staffForm!: FormGroup; // Definite assignment
  staffId: string | number | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  pageTitle: string = 'Edit Staff Member';

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''], // Optional
      role: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.staffId = id;
        this.loadStaffDetails(this.staffId);
      } else {
        this.errorMessage = 'No staff ID provided for editing.';
        this.pageTitle = 'Error';
        // Optionally navigate away or show a more prominent error
        // this.router.navigate(['/staff']);
      }
    });
  }

  loadStaffDetails(id: string | number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.staffService.getStaffById(id).subscribe({
      next: (staff: Staff) => {
        this.staffForm.patchValue({
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          phone: staff.phone,
          role: staff.role
        });
        this.pageTitle = `Edit Staff: ${staff.firstName} ${staff.lastName}`;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching staff details:', err);
        this.errorMessage = 'Failed to load staff details. ';
        if (err.status === 404) {
            this.errorMessage += 'Staff member not found.';
        } else {
            this.errorMessage += 'Please try again later.';
        }
        this.isLoading = false;
      }
    });
  }

  get f() { return this.staffForm.controls; }

  onSubmit(): void {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    if (!this.staffId) {
      this.errorMessage = "Cannot update staff: Staff ID is missing.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    const updatedStaffData: Staff = { ...this.staffForm.value, id: this.staffId };


    this.staffService.updateStaff(this.staffId, updatedStaffData).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Optionally, show a success message
        this.router.navigate(['/staff']);
      },
      error: (err) => {
        console.error('Error updating staff:', err);
        this.errorMessage = 'Failed to update staff. ';
        if (err.error && typeof err.error === 'object' && err.error.message) {
            this.errorMessage += err.error.message;
        } else if (err.message) {
            this.errorMessage += err.message;
        } else {
            this.errorMessage += 'Please try again later.';
        }
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/staff']);
  }
}
