import { Megaphone } from 'lucide-react';

import { Container } from '@/components/shared/container';

interface AnnouncementBarProps {
  text: string;
}

export function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <div className="bg-brand-highlight text-brand-ink">
      <Container className="flex items-center justify-center gap-2 py-2.5 text-center text-sm font-semibold">
        <Megaphone className="size-4 shrink-0" aria-hidden="true" />
        <p>{text}</p>
      </Container>
    </div>
  );
}
