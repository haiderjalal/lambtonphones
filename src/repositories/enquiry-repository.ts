import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  EnquiryStatus,
  EnquirySource,
  ServiceType,
  EnquiryReference,
} from '@/constants/enquiry';
import { getServiceRoleSupabaseClient } from '@/lib/supabase/service-client';
import type { EnquiryTriageValues } from '@/lib/validations/enquiry';
import { databaseError } from '@/repositories/db-error';
import type { Database } from '@/types/database';
import type { Enquiry } from '@/types/content';

export interface NewEnquiryRecord {
  reference: EnquiryReference;
  source: EnquirySource;
  serviceType: ServiceType;
  productId: string | null;
  fullName: string;
  email: string;
  phone: string;
  deviceModel: string;
  message: string;
  ipHash: string;
}

/** Inserts with the service role. Public visitors have no insert policy on this table. */
export async function insertEnquiry(record: NewEnquiryRecord): Promise<Enquiry> {
  const { data, error } = await getServiceRoleSupabaseClient()
    .from('enquiries')
    .insert({
      reference: record.reference,
      source: record.source,
      service_type: record.serviceType,
      product_id: record.productId,
      full_name: record.fullName,
      email: record.email,
      phone: record.phone,
      device_model: record.deviceModel,
      message: record.message,
      ip_hash: record.ipHash,
    })
    .select('*')
    .single();

  if (error) throw databaseError(error, 'enquiries.insert');

  return data;
}

export async function countEnquiriesSince(ipHash: string, sinceIso: string): Promise<number> {
  const { count, error } = await getServiceRoleSupabaseClient()
    .from('enquiries')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', sinceIso);

  if (error) throw databaseError(error, 'enquiries.countSince');

  return count ?? 0;
}

export async function listEnquiries(
  client: SupabaseClient<Database>,
  status: EnquiryStatus | null,
): Promise<Enquiry[]> {
  let query = client
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw databaseError(error, 'enquiries.list');

  return data;
}

export async function getEnquiryById(
  client: SupabaseClient<Database>,
  id: string,
): Promise<Enquiry | null> {
  const { data, error } = await client.from('enquiries').select('*').eq('id', id).maybeSingle();

  if (error) throw databaseError(error, 'enquiries.getById');

  return data;
}

export async function updateEnquiryTriage(
  client: SupabaseClient<Database>,
  values: EnquiryTriageValues,
): Promise<Enquiry> {
  const { data, error } = await client
    .from('enquiries')
    .update({ status: values.status, admin_notes: values.adminNotes })
    .eq('id', values.id)
    .select('*')
    .single();

  if (error) throw databaseError(error, 'enquiries.updateTriage');

  return data;
}
