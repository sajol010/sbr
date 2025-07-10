import { Customer } from '../../customer/models/customer.model';
import { Staff } from '../../staff/models/staff.model';
import { Service } from '../../../shared/models/service.model'; // Corrected path

export interface Booking {
  id?: string | number;
  service_id: number;
  staff_id: number;
  customer_id: number;
  booking_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time?: string;     // HH:MM (optional, might be determined by service duration)

  status?: string; // e.g., 'confirmed', 'pending', 'cancelled', 'completed'

  // Optional expanded objects for easier display on the frontend
  // These would typically be populated by the backend or through separate calls if needed
  customer?: Customer;
  staff?: Staff;
  service?: Service;

  notes?: string; // Optional notes for the booking

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
