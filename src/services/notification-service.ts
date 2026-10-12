import 'server-only';

import { getServerEnv } from '@/lib/env/server';
import { logger } from '@/lib/logger';
import type { Enquiry } from '@/types/content';
import { toSingleLine } from '@/utils/text';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_ATTEMPTS = 2;

/**
 * Emails the business about a new enquiry through Resend. Plain text only, so customer input
 * can never inject HTML into the message. Skipped quietly when email is not configured.
 */
export async function sendEnquiryNotification(enquiry: Enquiry): Promise<void> {
  const env = getServerEnv();

  if (!env.RESEND_API_KEY || !env.ENQUIRY_NOTIFY_EMAIL || !env.ENQUIRY_FROM_EMAIL) {
    logger.info('enquiry.notification_skipped', { reason: 'email_not_configured' });
    return;
  }

  await postWithRetry(
    {
      from: env.ENQUIRY_FROM_EMAIL,
      to: [env.ENQUIRY_NOTIFY_EMAIL],
      reply_to: enquiry.email,
      subject: toSingleLine(`New ${enquiry.service_type} enquiry (${enquiry.reference})`),
      text: buildPlainTextBody(enquiry),
    },
    env.RESEND_API_KEY,
  );

  logger.info('enquiry.notification_sent', { reference: enquiry.reference });
}

interface ResendPayload {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
}

async function postWithRetry(payload: ResendPayload, apiKey: string): Promise<void> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        cache: 'no-store',
      });

      if (response.ok) return;

      // Client errors (bad key, unverified sender) will not succeed on retry.
      if (response.status < 500 || attempt === MAX_ATTEMPTS) {
        throw new Error(`Resend rejected the notification with status ${response.status}.`);
      }
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) throw error;
    }
  }
}

function buildPlainTextBody(enquiry: Enquiry): string {
  const lines = [
    `Reference: ${enquiry.reference}`,
    `Type: ${enquiry.source.replace('_', ' ')}`,
    `Service: ${enquiry.service_type}`,
    `Name: ${enquiry.full_name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    `Device: ${enquiry.device_model || 'Not provided'}`,
    '',
    'Message:',
    enquiry.message || 'No message provided.',
  ];

  return lines.join('\n');
}
