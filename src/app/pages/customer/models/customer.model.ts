export interface Customer {
  id?: string | number;         // Corresponds to primary key, optional for creation
  firstName: string;           // Maps to first_name
  lastName?: string;          // Maps to last_name (nullable)
  email: string;               // Maps to email
  phone?: string;             // Maps to phone (nullable)
  companyName?: string;       // This field was in my previous model, schema doesn't explicitly list it.
                               // Keeping it optional for now unless it needs removal.
                               // If it was a misunderstanding, it can be removed.
  address: string;             // Maps to address (assuming this is the street/primary address line)
  city?: string;              // Maps to city (nullable)
  state?: string;             // Maps to state (nullable)
  zipcode?: string;           // Maps to zipcode (nullable)
  country?: string;           // Maps to country (nullable)
  profilePicUrl?: string;     // Maps to profile_pic (nullable), assuming it's a URL
  status?: number;            // Maps to status (e.g., 1 for Active, 0 for Inactive)
  createdAt?: string | Date;  // Often provided by backend
  updatedAt?: string | Date;  // Often provided by backend
}
