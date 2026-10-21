import {NextResponse} from 'next/server';
import {getViewer} from '@/lib/queries/account';
import {getAdminSupabase} from '@/lib/supabase/server';

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET() {
  const viewer = await getViewer();
  if (!viewer || (viewer.role !== 'admin' && viewer.role !== 'editor')) return NextResponse.json({error: 'Forbidden'}, {status: 403});
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({error: 'Supabase service role is not configured.'}, {status: 503});
  const {data, error} = await supabase.from('newsletter_subscribers').select('email, lang, confirmed, confirmed_at, created_at').order('created_at', {ascending: false});
  if (error) return NextResponse.json({error: error.message}, {status: 500});
  const rows = ['email,language,confirmed,confirmed_at,subscribed_at', ...(data ?? []).map((subscriber) => [subscriber.email, subscriber.lang, String(subscriber.confirmed), subscriber.confirmed_at ?? '', subscriber.created_at].map((value) => csvCell(String(value))).join(','))];
  return new NextResponse(rows.join('\n'), {headers: {'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="arewa-is-building-subscribers.csv"'}});
}
