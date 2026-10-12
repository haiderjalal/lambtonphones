'use server';

import { headers } from 'next/headers';

import { logger } from '@/lib/logger';
import { getClientIp } from '@/lib/security/client-ip';
import { enquirySchema, type EnquiryInput } from '@/lib/validations/enquiry';
import { toFieldErrors } from '@/lib/validations/errors';
import { EnquiryRateLimitError, submitEnquiry } from '@/services/enquiry-service';
import type { ActionResult } from '@/types/action-result';

const SUCCESS_MESSAGE =
  'Thanks, we have your details and will be in touch shortly. Keep your reference handy.';
const FAILURE_MESSAGE = 'We could not send your enquiry. Please try again, or call us directly.';

/** Public quote, contact and product enquiry form. Validation runs again on the server. */
export async function submitEnquiryAction(
  input: EnquiryInput,
): Promise<ActionResult<{ reference: string }>> {
  const parsed = enquirySchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please check the highlighted fields.',
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const requestHeaders = await headers();

  try {
    const { reference } = await submitEnquiry(parsed.data, getClientIp(requestHeaders));

    return { ok: true, message: SUCCESS_MESSAGE, data: { reference } };
  } catch (error) {
    if (error instanceof EnquiryRateLimitError) {
      return { ok: false, message: error.message };
    }

    logger.error('enquiry.submit_failed', error);

    return { ok: false, message: FAILURE_MESSAGE };
  }
}
