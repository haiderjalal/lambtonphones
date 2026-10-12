import 'server-only';

import { ENQUIRY_RATE_LIMIT } from '@/constants/business';
import type { EnquiryReference } from '@/constants/enquiry';
import { getServerEnv } from '@/lib/env/server';
import { logger } from '@/lib/logger';
import { hashClientIp } from '@/lib/security/ip-hash';
import type { EnquiryValues } from '@/lib/validations/enquiry';
import { countEnquiriesSince, insertEnquiry } from '@/repositories/enquiry-repository';
import { createEnquiryReference } from '@/utils/enquiry-reference';
import { sendEnquiryNotification } from '@/services/notification-service';

export class EnquiryRateLimitError extends Error {
  constructor() {
    super(
      'You have sent several enquiries recently. Please wait a few minutes, or call us directly.',
    );
    this.name = 'EnquiryRateLimitError';
  }
}

export interface EnquirySubmissionResult {
  reference: EnquiryReference;
}

/**
 * Stores an enquiry after the anti-spam checks and then notifies the business.
 * The record is the source of truth. A failed email never fails the customer's submission.
 */
export async function submitEnquiry(
  values: EnquiryValues,
  clientIp: string,
): Promise<EnquirySubmissionResult> {
  // Bots fill every field, including the hidden one. Pretend success without storing anything.
  if (values.website && values.website.length > 0) {
    logger.warn('enquiry.honeypot_triggered');
    return { reference: createEnquiryReference() };
  }

  const ipHash = hashClientIp(clientIp, getServerEnv().IP_HASH_SECRET);
  const windowStart = new Date(
    Date.now() - ENQUIRY_RATE_LIMIT.windowMinutes * 60_000,
  ).toISOString();
  const recentCount = await countEnquiriesSince(ipHash, windowStart);

  if (recentCount >= ENQUIRY_RATE_LIMIT.maxSubmissions) {
    logger.warn('enquiry.rate_limited', { recentCount });
    throw new EnquiryRateLimitError();
  }

  const reference = createEnquiryReference();
  const enquiry = await insertEnquiry({
    reference,
    source: values.source,
    serviceType: values.serviceType,
    productId: values.productId,
    fullName: values.fullName,
    email: values.email,
    phone: values.phone,
    deviceModel: values.deviceModel,
    message: values.message,
    ipHash,
  });

  logger.info('enquiry.stored', { reference: enquiry.reference, source: enquiry.source });

  try {
    await sendEnquiryNotification(enquiry);
  } catch (error) {
    logger.error('enquiry.notification_failed', error, { reference: enquiry.reference });
  }

  return { reference: enquiry.reference };
}
