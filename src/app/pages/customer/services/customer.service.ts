import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // TODO: Move this to environment files
  private apiUrl = 'http://localhost:8000/api/customers';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    // TODO: Add actual token retrieval logic if authentication is needed
    // const token = localStorage.getItem('authToken');
    // return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createCustomer(customerData: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customerData, { headers: this.getHeaders() });
  }

  getCustomerById(id: string | number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateCustomer(id: string | number, customerData: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customerData, { headers: this.getHeaders() });
  }

  deleteCustomer(id: string | number): Observable<any> { // Delete typically returns status or empty body
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
