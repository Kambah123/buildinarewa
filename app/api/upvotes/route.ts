import {revalidatePath} from 'next/cache';
import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getServerSupabase} from '@/lib/supabase/server';

const voteSchema = z.object({productId: z.string().uuid()});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: 'Send a JSON request body.'}, {status: 400});
  }
  const parsed = voteSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({error: 'Invalid product id.'}, {status: 400});

  const supabase = await getServerSupabase();
  if (!supabase) return NextResponse.json({error: 'Voting is not configured yet.'}, {status: 503});
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: 'Sign in to vote.', code: 'UNAUTHENTICATED'}, {status: 401});

  const {data, error} = await supabase.rpc('toggle_product_upvote', {target_product_id: parsed.data.productId});
  if (error) {
    const status = /Too many vote/i.test(error.message) ? 429 : 400;
    return NextResponse.json({error: error.message}, {status});
  }
  const result = Array.isArray(data) ? data[0] : data;
  revalidatePath('/', 'layout');
  return NextResponse.json({upvoted: Boolean(result?.upvoted), upvoteCount: Number(result?.upvote_count ?? 0)});
}
