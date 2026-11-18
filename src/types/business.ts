export type LeadStatus =
  | "New"
  | "Contacted"
  | "Interested"
  | "Converted";

export type Lead = {
  id: string;
  userId?: string;

  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;

  country?: string;
  city?: string;
  category?: string;

  status: LeadStatus;
  notes?: string;

  createdAt: string | Date;
  updatedAt: string | Date;
};

export type LeadInput = {
  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
  category?: string;
  status?: LeadStatus;
  notes?: string;
};