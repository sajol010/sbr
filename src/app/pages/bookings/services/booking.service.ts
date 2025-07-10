import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { TimeSlot } from '../models/time-slot.model';
import { AvailableSlotsParams } from '../models/available-slots-params.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  // TODO: Move to environment files
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Headers are likely handled by an interceptor for Bearer token.
  // This can be used for specific content types if needed.
  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * GET /api/available-slots?staff_id={id}&service_id={id}&date=YYYY-MM-DD
   */
  getAvailableSlots(params: AvailableSlotsParams): Observable<TimeSlot[]> {
    let httpParams = new HttpParams()
      .set('staff_id', params.staff_id.toString())
      .set('service_id', params.service_id.toString())
      .set('date', params.date);
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/available-slots`, { params: httpParams });
  }

  /**
   * POST /api/bookings
   */
  createBooking(bookingData: Omit<Booking, 'id' | 'customer' | 'staff' | 'service' | 'createdAt' | 'updatedAt'>): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, bookingData, { headers: this.getHeaders() });
  }

  /**
   * GET /api/bookings?filter=upcoming or ?filter=past
   * Optional Filters: customer_id, staff_id, date_from, date_to
   */
  getBookings(filter: 'upcoming' | 'past', queryParams?: { customer_id?: number, staff_id?: number, date_from?: string, date_to?: string }): Observable<Booking[]> {
    let httpParams = new HttpParams().set('filter', filter);
    if (queryParams) {
      if (queryParams.customer_id) {
        httpParams = httpParams.set('customer_id', queryParams.customer_id.toString());
      }
      if (queryParams.staff_id) {
        httpParams = httpParams.set('staff_id', queryParams.staff_id.toString());
      }
      if (queryParams.date_from) {
        httpParams = httpParams.set('date_from', queryParams.date_from);
      }
      if (queryParams.date_to) {
        httpParams = httpParams.set('date_to', queryParams.date_to);
      }
    }
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`, { params: httpParams });
  }

  /**
   * GET /api/bookings/{id}
   */
  getBookingById(id: string | number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`);
  }

  /**
   * PUT /api/bookings/{id} (for reschedule)
   * Payload: { booking_date: "YYYY-MM-DD", start_time: "HH:MM" }
   */
  updateBooking(id: string | number, bookingData: { booking_date: string, start_time: string }): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}`, bookingData, { headers: this.getHeaders() });
  }

  // Alternative Reschedule: POST /api/bookings/{id}/reschedule
  // rescheduleBooking(id: string | number, data: { booking_date: string, start_time: string }): Observable<Booking> {
  //   return this.http.post<Booking>(`${this.apiUrl}/bookings/${id}/reschedule`, data, { headers: this.getHeaders() });
  // }

  /**
   * DELETE /api/bookings/{id}
   */
  cancelBooking(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/bookings/${id}`);
  }
}
