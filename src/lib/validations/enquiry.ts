import { z } from 'zod';

import { ENQUIRY_SERVICE_TYPES, ENQUIRY_SOURCES, ENQUIRY_STATUSES } from '@/constants/enquiry';
import { SERVICE_ICON_KEYS } from '@/constants/icons';
import { emailSchema, optionalText, phoneSchema, requiredText } from '@/lib/validations/common';

export const enquirySchema = z
  .object({
    source: z.enum(ENQUIRY_SOURCES, { error: 'Unknown enquiry type.' }),
    serviceType: z.enum(ENQUIRY_SERVICE_TYPES, { error: 'Choose a service type.' }),
    fullName: requiredText('Full name', { min: 2, max: 120 }),
    email: emailSchema,
    phone: phoneSchema,
    deviceModel: optionalText('Device model', 120),
    message: optionalText('Message', 2000),
    productId: z.uuid({ error: 'That product could not be found.' }).nullable(),
    // Honeypot: hidden from people, so only automated form fillers populate it.
    website: z.string().max(500).optional(),
  })
  .refine((enquiry) => enquiry.source !== 'product_enquiry' || enquiry.productId !== null, {
    path: ['productId'],
    message: 'Choose the product you want to enquire about.',
  });

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryValues = z.output<typeof enquirySchema>;

export const enquiryTriageSchema = z.object({
  id: z.uuid({ error: 'Enquiry not found.' }),
  status: z.enum(ENQUIRY_STATUSES, { error: 'Choose a valid status.' }),
  adminNotes: optionalText('Internal notes', 4000),
});

export type EnquiryTriageInput = z.input<typeof enquiryTriageSchema>;
export type EnquiryTriageValues = z.output<typeof enquiryTriageSchema>;

export const iconKeySchema = z.enum(SERVICE_ICON_KEYS, { error: 'Choose an icon.' });
