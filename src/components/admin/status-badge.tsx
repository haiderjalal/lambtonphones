import { Badge } from '@/components/ui/badge';
import { ENQUIRY_STATUS_LABELS, type EnquiryStatus } from '@/constants/enquiry';
import { cn } from '@/lib/utils';

const STATUS_TONES: Record<EnquiryStatus, string> = {
  new: 'bg-sky-100 text-sky-900 border-sky-200',
  contacted: 'bg-violet-100 text-violet-900 border-violet-200',
  quoted: 'bg-amber-100 text-amber-900 border-amber-200',
  booked: 'bg-indigo-100 text-indigo-900 border-indigo-200',
  completed: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
};

/** Status pill. The text label carries the meaning, so colour is never the only signal. */
export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <Badge variant="outline" className={cn('font-semibold', STATUS_TONES[status])}>
      {ENQUIRY_STATUS_LABELS[status]}
    </Badge>
  );
}

export function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return isPublished ? (
    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-900">
      Published
    </Badge>
  ) : (
    <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700">
      Draft
    </Badge>
  );
}
