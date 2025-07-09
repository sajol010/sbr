export interface Staff {
  id?: string | number;       // Optional for creation
  firstName: string;
  lastName?: string;          // Making lastName optional as it often is
  email: string;
  phone?: string;             // Optional
  role: string;               // e.g., 'Admin', 'Manager', 'Employee'

  address1: string;           // Required address line 1
  address2?: string;          // Optional address line 2
  city?: string;              // Optional
  state?: string;             // Optional
  zipcode?: string;           // Optional
  country?: string;           // Optional

  profilePicUrl?: string;     // Optional URL for profile picture
  status?: number;            // Optional: 1 for Active, 0 for Inactive (or other codes)

  // Retaining these as they are common and might be useful
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
