import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StaffService } from '../services/staff.service';
// import { Staff } from '../models/staff.model'; // Not strictly needed here if using form value directly

@Component({
  selector: 'app-staff-add',
  standalone: false, // Will be part of StaffModule
  // imports: [ReactiveFormsModule, CommonModule], // Needed if standalone: true. CommonModule for ngIf etc.
  templateUrl: './staff-add.component.html',
  styleUrl: './staff-add.component.css'
})
export class StaffAddComponent implements OnInit {
  staffForm!: FormGroup; // Definite assignment assertion
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''], // Optional
      role: ['', Validators.required] // e.g., 'Admin', 'Manager', 'Employee'
      // Add other fields as per your Staff model
    });
  }

  // Getter for easy access to form controls in the template
  get f() { return this.staffForm.controls; }

  onSubmit(): void {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched(); // Mark all fields as touched to display errors
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.staffService.createStaff(this.staffForm.value).subscribe({
      next: (newStaff) => {
        console.log('Staff created successfully:', newStaff);
        this.isSubmitting = false;
        // Optionally, show a success message (e.g., using a toastr service)
        this.router.navigate(['/staff']); // Navigate to staff list
      },
      error: (err) => {
        console.error('Error creating staff:', err);
        this.errorMessage = 'Failed to create staff. ';
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
