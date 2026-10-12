'use client';

import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { updateEnquiryTriageAction } from '@/actions/admin-enquiry-actions';
import { FormActions } from '@/components/admin/form-actions';
import { FormField } from '@/components/forms/form-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ENQUIRY_STATUS_LABELS, ENQUIRY_STATUSES, type EnquiryStatus } from '@/constants/enquiry';
import { useActionForm } from '@/hooks/use-action-form';
import { enquiryTriageSchema, type EnquiryTriageInput } from '@/lib/validations/enquiry';

interface EnquiryTriageFormProps {
  enquiryId: string;
  status: EnquiryStatus;
  adminNotes: string;
}

/** Lets staff move an enquiry through the pipeline and keep internal notes beside it. */
export function EnquiryTriageForm({ enquiryId, status, adminNotes }: EnquiryTriageFormProps) {
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const defaultValues: EnquiryTriageInput = { id: enquiryId, status, adminNotes };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: enquiryTriageSchema,
    defaultValues,
    action: updateEnquiryTriageAction,
  });

  const {
    formState: { errors },
    register,
    control,
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Follow-up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} noValidate className="grid gap-5">
          <FormField id={fieldId('status')} label="Status" required error={errors.status?.message}>
            {(aria) => (
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={aria.id}
                      aria-invalid={aria['aria-invalid']}
                      aria-describedby={aria['aria-describedby']}
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENQUIRY_STATUSES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {ENQUIRY_STATUS_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>

          <FormField
            id={fieldId('adminNotes')}
            label="Internal notes"
            error={errors.adminNotes?.message}
            hint="Only visible to staff."
          >
            {(aria) => <Textarea rows={6} {...aria} {...register('adminNotes')} />}
          </FormField>

          <FormActions isPending={isPending} feedback={feedback} submitLabel="Update enquiry" />
        </form>
      </CardContent>
    </Card>
  );
}
