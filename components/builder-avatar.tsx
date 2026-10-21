import Image from 'next/image';
import {UserRound} from 'lucide-react';
import {cn} from '@/lib/utils';

export function BuilderAvatar({name, src, className}: {name: string; src?: string | null; className?: string}) {
  if (src) return <Image src={src} alt={`${name} portrait`} width={128} height={128} className={cn('size-12 rounded-full border border-[var(--line)] object-cover grayscale transition duration-200 hover:grayscale-0', className)} />;
  return <div aria-label={`${name} profile placeholder`} className={cn('grid size-12 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-[var(--indigo)]', className)}><UserRound size={20} aria-hidden /></div>;
}
