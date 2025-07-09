export interface Staff {
  id?: string | number; // Optional for creation, usually a number or string from DB
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; // Optional
  role: string; // e.g., 'Admin', 'Manager', 'Employee'
  // Add any other relevant fields
  // Example:
  // department?: string;
  // hireDate?: Date;
  // isActive?: boolean;
  // profileImageUrl?: string;
}
