import Image from 'next/image';
import {Box} from 'lucide-react';
import {cn} from '@/lib/utils';

export function ProductLogo({name, src, className}: {name: string; src?: string | null; className?: string}) {
  if (src) {
    return <Image src={src} alt={`${name} logo`} width={96} height={96} className={cn('size-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] object-cover', className)} />;
  }
  return (
    <div className={cn('grid size-12 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--indigo)]', className)} aria-label={`${name} logo placeholder`}>
      <Box size={20} strokeWidth={1.7} aria-hidden />
    </div>
  );
}
