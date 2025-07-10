import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Service } from '../models/service.model'; // Adjust path if model is elsewhere

@Injectable({
  providedIn: 'root' // Provided in root to be available application-wide
})
export class ServiceService {

  constructor() { }

  // Returns a hardcoded list of services for dropdown population
  getServices(): Observable<Service[]> {
    const mockServices: Service[] = [
      { id: 1, name: 'General Consultation' },
      { id: 2, name: 'Specialist Session' },
      { id: 3, name: 'Follow-up Meeting' },
      { id: 4, name: 'Service Package A' },
      { id: 5, name: 'Service Package B' }
    ];
    return of(mockServices); // 'of' creates an Observable from the array
  }

  // In a real application, this would fetch from an API:
  // getServices(): Observable<Service[]> {
  //   return this.http.get<Service[]>(`${this.apiUrl}/services`);
  // }
}
