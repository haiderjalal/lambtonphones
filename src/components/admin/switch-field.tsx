'use client';

import { Switch } from '@/components/ui/switch';

interface SwitchFieldProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** Labelled on/off control for publish and feature flags. */
export function SwitchField({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: SwitchFieldProps) {
  return (
    <div className="border-border bg-card flex items-start justify-between gap-4 rounded-xl border px-4 py-3.5">
      <div className="grid gap-0.5">
        <label htmlFor={id} className="text-brand-ink text-sm font-medium">
          {label}
        </label>
        {description ? <p className="text-muted-foreground text-xs">{description}</p> : null}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
