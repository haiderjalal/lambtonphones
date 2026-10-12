/**
 * Enquiry vocabulary. These values must match the check constraints in
 * supabase/migrations (enquiries.source, enquiries.service_type, enquiries.status).
 */

export const ENQUIRY_SERVICE_TYPES = [
  'Phone Repair',
  'Laptop Repair',
  'Tablet Repair',
  'Console Repair',
  'Data Recovery',
  'Screen Replacement',
  'Other',
] as const;

export type ServiceType = (typeof ENQUIRY_SERVICE_TYPES)[number];

export const ENQUIRY_SOURCES = ['quote_form', 'contact_form', 'product_enquiry'] as const;

export type EnquirySource = (typeof ENQUIRY_SOURCES)[number];

export const ENQUIRY_STATUSES = [
  'new',
  'contacted',
  'quoted',
  'booked',
  'completed',
  'closed',
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  booked: 'Booked in',
  completed: 'Completed',
  closed: 'Closed',
};

/** Customer-facing reference, e.g. LP-7K2Q9D4M. Shown to the customer and used when calling in. */
export type EnquiryReference = `LP-${string}`;

export const ENQUIRY_SERVICE_TYPE_BY_SERVICE_SLUG: Record<string, ServiceType> = {
  'phone-repair': 'Phone Repair',
  'laptop-repair': 'Laptop Repair',
  'tablet-repair': 'Tablet Repair',
  'console-repair': 'Console Repair',
  'data-recovery': 'Data Recovery',
};
