import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css'],
  standalone: false, // Explicitly set to false
})
export class CustomerAddComponent implements OnInit {
  customerForm!: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''], // Nullable in DB, so not strictly required in form unless UX dictates
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      companyName: [''], // Retained as optional from previous model version
      address: ['', Validators.required], // Main address line
      city: [''],
      state: [''],
      zipcode: [''],
      country: [''],
      profilePicUrl: [''], // URL for profile picture
      status: [1] // Default to 1 (Active)
    });
  }

  get f() { return this.customerForm.controls; }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.customerService.createCustomer(this.customerForm.value).subscribe({
      next: (newCustomer) => {
        console.log('Customer created successfully:', newCustomer);
        this.isSubmitting = false;
        // Optionally, show a success message (e.g., using a toastr service)
        this.router.navigate(['/admin/customers']);
      },
      error: (err) => {
        console.error('Error creating customer:', err);
        this.errorMessage = 'Failed to create customer. ';
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
    this.router.navigate(['/admin/customers']);
  }
}
