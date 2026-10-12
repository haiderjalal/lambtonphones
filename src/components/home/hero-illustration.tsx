import { Battery, CircleCheck, Cpu, ShieldCheck } from 'lucide-react';

/**
 * Decorative device illustration. Animations are CSS only, and reduced motion turns them off.
 * It is built in SVG and CSS, so it adds no image requests.
 */
export function HeroIllustration() {
  return (
    <div
      aria-hidden="true"
      className="animate-fade-in relative mx-auto aspect-[4/5] w-full max-w-sm"
    >
      <div className="from-primary/40 via-brand-glow/10 animate-glow absolute inset-6 rounded-[3rem] bg-gradient-to-br to-transparent blur-2xl" />

      <div className="animate-float bg-brand-ink-soft relative mx-auto h-full w-[78%] rounded-[2.5rem] border border-white/15 p-3 shadow-2xl shadow-black/40">
        <div className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="absolute inset-x-0 top-3 mx-auto h-5 w-24 rounded-full bg-black" />

          <div className="absolute inset-x-6 top-16 grid gap-3">
            <div className="h-2 w-3/4 rounded-full bg-white/10" />
            <div className="h-2 w-1/2 rounded-full bg-white/10" />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((item) => (
                <span key={item} className="aspect-square rounded-2xl bg-white/5" />
              ))}
            </div>
          </div>

          <div className="via-brand-glow/25 animate-scan absolute inset-x-0 h-24 bg-gradient-to-b from-transparent to-transparent" />

          <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-lg">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CircleCheck className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-brand-ink truncate text-sm font-semibold">Screen replaced</p>
              <p className="text-muted-foreground text-xs">Tested and ready to go</p>
            </div>
          </div>
        </div>
      </div>

      <FloatingChip
        className="animate-float-slow top-14 -left-2"
        icon={<Battery className="size-4" />}
        label="Battery health"
        value="Restored"
      />
      <FloatingChip
        className="animate-float top-1/2 -right-2"
        icon={<ShieldCheck className="size-4" />}
        label="Warranty"
        value="3 months"
      />
      <FloatingChip
        className="animate-float-slow bottom-28 -left-4"
        icon={<Cpu className="size-4" />}
        label="Diagnostics"
        value="Free"
      />
    </div>
  );
}

function FloatingChip({
  className,
  icon,
  label,
  value,
}: {
  className: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white shadow-xl shadow-black/30 backdrop-blur-md ${className}`}
    >
      <span className="bg-brand-glow/20 text-brand-glow flex size-8 items-center justify-center rounded-lg">
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] text-slate-300">{label}</span>
        <span className="block text-sm font-semibold">{value}</span>
      </span>
    </div>
  );
}
