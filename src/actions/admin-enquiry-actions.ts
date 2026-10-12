'use server';

import { enquiryTriageSchema, type EnquiryTriageInput } from '@/lib/validations/enquiry';
import { updateEnquiryTriage } from '@/repositories/enquiry-repository';
import { runAdminMutation } from '@/services/admin-mutation';
import type { ActionResult } from '@/types/action-result';

/** Enquiries are not cached on the public site, so this action invalidates nothing. */
export async function updateEnquiryTriageAction(
  input: EnquiryTriageInput,
): Promise<ActionResult<undefined>> {
  return runAdminMutation({
    name: 'enquiries.triage',
    schema: enquiryTriageSchema,
    input,
    recordId: null,
    successMessage: 'Enquiry updated.',
    invalidates: [],
    execute: async (values, admin) => {
      await updateEnquiryTriage(admin.client, values);
      return undefined;
    },
  });
}
