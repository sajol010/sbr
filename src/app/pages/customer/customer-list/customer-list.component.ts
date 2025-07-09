import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  standalone: false, // Explicitly set to false
})
export class CustomerListComponent implements OnInit {
  customerList: Customer[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customerList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.errorMessage = 'Failed to load customers. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  navigateToAddCustomer(): void {
    this.router.navigate(['/admin/customers/add']); // Updated route
  }

  navigateToEditCustomer(id: string | number | undefined): void {
    if (id === undefined) {
      console.error('Cannot navigate to edit: Customer ID is undefined');
      return;
    }
    this.router.navigate(['/admin/customers/edit', id]); // Updated route
  }

  deleteCustomer(id: string | number | undefined): void {
    if (id === undefined) {
      console.error('Cannot delete: Customer ID is undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.customerList = this.customerList.filter(customer => customer.id !== id);
        },
        error: (err) => {
          console.error('Error deleting customer:', err);
          this.errorMessage = 'Failed to delete customer. Please try again.';
        }
      });
    }
  }
}
