'use client';

import { CircleCheck, Send } from 'lucide-react';
import Link from 'next/link';
import { useId, useState } from 'react';
import { Controller } from 'react-hook-form';

import { submitEnquiryAction } from '@/actions/enquiry-actions';
import { FeedbackBanner } from '@/components/shared/feedback-banner';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ENQUIRY_SERVICE_TYPES, type EnquirySource, type ServiceType } from '@/constants/enquiry';
import { ROUTES } from '@/constants/routes';
import { useActionForm } from '@/hooks/use-action-form';
import { enquirySchema, type EnquiryInput } from '@/lib/validations/enquiry';

interface QuoteFormProps {
  source: EnquirySource;
  defaultServiceType: ServiceType;
  productId?: string | null;
  productName?: string;
  submitLabel?: string;
  className?: string;
}

/**
 * Quote, contact and product enquiry form. The same schema validates in the browser and on the
 * server. The hidden honeypot field catches bots without adding a CAPTCHA for real visitors.
 */
export function QuoteForm({
  source,
  defaultServiceType,
  productId = null,
  productName,
  submitLabel = 'Request my free quote',
  className,
}: QuoteFormProps) {
  const formId = useId();
  const [reference, setReference] = useState<string | null>(null);

  const defaultValues: EnquiryInput = {
    source,
    serviceType: defaultServiceType,
    fullName: '',
    email: '',
    phone: '',
    deviceModel: '',
    message: productName ? `I would like to enquire about: ${productName}.` : '',
    productId,
    website: '',
  };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: enquirySchema,
    defaultValues,
    action: submitEnquiryAction,
    onSuccess: (data) => {
      setReference(data?.reference ?? null);
      form.reset(defaultValues);
    },
  });

  const {
    formState: { errors },
    register,
    control,
  } = form;
  const fieldId = (name: string) => `${formId}-${name}`;

  if (reference) {
    return (
      <div className={className}>
        <div className="animate-fade-up flex flex-col items-start gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <span className="animate-pop flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white">
            <CircleCheck className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-semibold text-emerald-950">Thanks, we have your enquiry.</p>
            <p className="mt-1 text-sm text-emerald-900">
              Your reference is <span className="font-mono font-semibold">{reference}</span>. Quote
              it if you call us.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => setReference(null)}>
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={className}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id={fieldId('fullName')}
          label="Full name"
          required
          error={errors.fullName?.message}
        >
          {(control) => <Input autoComplete="name" {...control} {...register('fullName')} />}
        </FormField>

        <FormField
          id={fieldId('phone')}
          label="Phone number"
          required
          error={errors.phone?.message}
        >
          {(aria) => (
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="02 4957 8574"
              {...aria}
              {...register('phone')}
            />
          )}
        </FormField>

        <FormField
          id={fieldId('email')}
          label="Email address"
          required
          error={errors.email?.message}
          className="sm:col-span-2"
        >
          {(aria) => (
            <Input
              type="email"
              autoComplete="email"
              inputMode="email"
              {...aria}
              {...register('email')}
            />
          )}
        </FormField>

        <FormField
          id={fieldId('serviceType')}
          label="Service type"
          required
          error={errors.serviceType?.message}
        >
          {(aria) => (
            <Controller
              control={control}
              name="serviceType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={aria.id}
                    aria-invalid={aria['aria-invalid']}
                    aria-describedby={aria['aria-describedby']}
                    className="w-full"
                  >
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENQUIRY_SERVICE_TYPES.map((serviceType) => (
                      <SelectItem key={serviceType} value={serviceType}>
                        {serviceType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </FormField>

        <FormField
          id={fieldId('deviceModel')}
          label="Device and model"
          hint="For example, iPhone 13 or Galaxy S22."
          error={errors.deviceModel?.message}
        >
          {(aria) => <Input {...aria} {...register('deviceModel')} />}
        </FormField>

        <FormField
          id={fieldId('message')}
          label="What is going on?"
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          {(aria) => <Textarea rows={4} {...aria} {...register('message')} />}
        </FormField>
      </div>

      {/* Honeypot: hidden from people and assistive technology. Bots tend to fill every input. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId('website')}>Leave this field empty</label>
        <input
          id={fieldId('website')}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} className="mt-6" />
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-xs">
          We use your details only to reply to this enquiry. Read our{' '}
          <Link
            href={ROUTES.privacy}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            privacy policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" disabled={isPending} className="sm:min-w-56">
          {isPending ? 'Sending...' : submitLabel}
          {!isPending ? <Send className="size-4" aria-hidden="true" /> : null}
        </Button>
      </div>
    </form>
  );
}
