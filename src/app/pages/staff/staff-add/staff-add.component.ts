import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StaffService } from '../services/staff.service';
// import { Staff } from '../models/staff.model'; // Not strictly needed here if using form value directly

@Component({
  selector: 'app-staff-add',
  standalone: false,
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.css'] // Corrected to styleUrls
})
export class StaffAddComponent implements OnInit {
  staffForm!: FormGroup;
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
      lastName: [''], // Optional based on model
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: [''],
      state: [''],
      zipcode: [''],
      country: [''],
      profilePicUrl: [''],
      status: [1, Validators.required] // Default to Active (1) and make it required
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
