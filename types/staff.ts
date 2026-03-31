export interface StaffMember {
  id: number;
  name: string;
  designation: string; // renamed from position
  cadre?: string; // optional
  email?: string;
  phone?: string;
  translations?: {
    hi?: {
      name?: string;
      designation?: string;
      cadre?: string;
    };
  } | null;
}
