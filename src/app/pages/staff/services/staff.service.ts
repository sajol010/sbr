import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staff } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  // TODO: Move this to environment files
  private apiUrl = 'http://localhost:8000/api/staff'; // Assuming Laravel API is at /api

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    // TODO: Add actual token retrieval logic if authentication is needed
    // const token = localStorage.getItem('authToken');
    // return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createStaff(staffData: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, staffData, { headers: this.getHeaders() });
  }

  getStaffById(id: string | number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateStaff(id: string | number, staffData: Staff): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staffData, { headers: this.getHeaders() });
  }

  deleteStaff(id: string | number): Observable<any> { // Delete typically returns status or empty body
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
