import { describe, expect, it } from 'vitest';

import { enquirySchema } from '@/lib/validations/enquiry';

const PRODUCT_ID = '3f1c2d4e-5a6b-4c7d-8e9f-0a1b2c3d4e5f';

const validQuote = {
  source: 'quote_form',
  serviceType: 'Phone Repair',
  fullName: '  Jane  Citizen ',
  email: 'Jane@Example.com',
  phone: '0412 345 678',
  deviceModel: 'iPhone 13',
  message: 'Cracked screen',
  productId: null,
  website: '',
} as const;

describe('enquirySchema', () => {
  it('accepts a valid quote and normalises the customer details', () => {
    const result = enquirySchema.safeParse(validQuote);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe('Jane  Citizen');
      expect(result.data.email).toBe('jane@example.com');
    }
  });

  it('rejects an email address that is not valid', () => {
    expect(enquirySchema.safeParse({ ...validQuote, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects a phone number that is too short to call', () => {
    expect(enquirySchema.safeParse({ ...validQuote, phone: '123' }).success).toBe(false);
  });

  it('requires a product when the enquiry is about a product', () => {
    const result = enquirySchema.safeParse({
      ...validQuote,
      source: 'product_enquiry',
      productId: null,
    });

    expect(result.success).toBe(false);
  });

  it('accepts a product enquiry that names the product', () => {
    const result = enquirySchema.safeParse({
      ...validQuote,
      source: 'product_enquiry',
      serviceType: 'Other',
      productId: PRODUCT_ID,
    });

    expect(result.success).toBe(true);
  });

  it('removes control characters from the message', () => {
    const result = enquirySchema.safeParse({ ...validQuote, message: 'Hi\u0007 there' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe('Hi there');
    }
  });
});
