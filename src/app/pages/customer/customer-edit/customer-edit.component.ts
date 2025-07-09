import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit {
  customerForm!: FormGroup;
  customerId: string | number | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  pageTitle: string = 'Edit Customer';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''], // Nullable in DB
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      companyName: [''], // Retained as optional
      address: ['', Validators.required], // Main address line
      city: [''],
      state: [''],
      zipcode: [''],
      country: [''],
      profilePicUrl: [''], // URL for profile picture
      status: [1] // Default, will be overridden by fetched data
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.customerId = id;
        this.loadCustomerDetails(this.customerId);
      } else {
        this.errorMessage = 'No customer ID provided for editing.';
        this.pageTitle = 'Error Loading Customer';
      }
    });
  }

  loadCustomerDetails(id: string | number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.customerService.getCustomerById(id).subscribe({
      next: (customer: Customer) => {
        this.customerForm.patchValue(customer); // patchValue is good for partial matches too
        this.pageTitle = `Edit Customer: ${customer.firstName} ${customer.lastName}`;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching customer details:', err);
        this.errorMessage = 'Failed to load customer details. ';
        if (err.status === 404) {
          this.errorMessage += 'Customer not found.';
        } else {
          this.errorMessage += 'Please try again later.';
        }
        this.isLoading = false;
      }
    });
  }

  get f() { return this.customerForm.controls; }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    if (!this.customerId) {
      this.errorMessage = "Cannot update customer: Customer ID is missing.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    // Ensure 'id' is part of the payload if your backend expects it,
    // or ensure the service sends it correctly with PUT.
    // The service's updateCustomer(id, data) should handle the URL part.
    const updatedCustomerData: Customer = { ...this.customerForm.value };


    this.customerService.updateCustomer(this.customerId, updatedCustomerData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/customers']);
      },
      error: (err) => {
        console.error('Error updating customer:', err);
        this.errorMessage = 'Failed to update customer. ';
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
