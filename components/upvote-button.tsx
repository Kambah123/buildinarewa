'use client';

import {ArrowUp} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import {useState} from 'react';

export function UpvoteButton({productId, initialCount, initiallyUpvoted = false, compact = false, locale}: {productId: string; initialCount: number; initiallyUpvoted?: boolean; compact?: boolean; locale: 'en' | 'ha'}) {
  const [upvoted, setUpvoted] = useState(initiallyUpvoted);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Product');

  async function toggleVote() {
    if (pending) return;
    setError('');
    const priorUpvoted = upvoted;
    const priorCount = count;
    setUpvoted(!priorUpvoted);
    setCount(Math.max(0, priorCount + (priorUpvoted ? -1 : 1)));
    setPending(true);

    try {
      const response = await fetch('/api/upvotes', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({productId})
      });
      const result = (await response.json()) as {upvoted?: boolean; upvoteCount?: number; error?: string; code?: string};
      if (response.status === 401 && result.code === 'UNAUTHENTICATED') {
        router.push(`/${locale}/sign-in?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!response.ok || typeof result.upvoted !== 'boolean' || typeof result.upvoteCount !== 'number') throw new Error(result.error ?? t('voteError'));
      setUpvoted(result.upvoted);
      setCount(result.upvoteCount);
    } catch (voteError) {
      setUpvoted(priorUpvoted);
      setCount(priorCount);
      setError(voteError instanceof Error ? voteError.message : t('voteError'));
    } finally {
      setPending(false);
    }
  }

  return <div className="relative">
    <button type="button" aria-pressed={upvoted} aria-label={upvoted ? t('upvoted') : t('upvote')} title={upvoted ? t('upvoted') : t('upvote')} onClick={toggleVote} disabled={pending} className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-bold transition disabled:opacity-60 ${upvoted ? 'border-[var(--indigo)] bg-[var(--indigo)] text-white' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--indigo)] hover:text-[var(--indigo)]'} ${compact ? '' : 'sm:px-3'}`}>
      <ArrowUp size={14} strokeWidth={2.2} aria-hidden />
      <span className="tabular-nums">{count}</span>
      {!compact ? <span className="hidden sm:inline">{upvoted ? t('upvoted') : t('upvote')}</span> : null}
    </button>
    {error ? <p role="alert" className="absolute right-0 top-full z-10 mt-2 w-52 rounded-lg border border-red-200 bg-white p-2 text-xs leading-5 text-red-800 shadow-lg dark:bg-[var(--surface)] dark:text-red-200">{error}</p> : null}
  </div>;
}
