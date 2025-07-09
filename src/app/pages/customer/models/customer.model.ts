export interface Customer {
  id?: string | number; // Optional for creation
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; // Optional
  companyName?: string; // Optional
  // Address can be simple strings or a nested object
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  addressCountry?: string;
  // Example of a nested address object, if preferred:
  // address?: {
  //   street: string;
  //   city: string;
  //   state: string;
  //   zipCode: string;
  //   country: string;
  // };
  createdAt?: string | Date; // Often provided by backend
  updatedAt?: string | Date; // Often provided by backend
}
