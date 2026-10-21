import {NextResponse} from 'next/server';
import {hasSupabaseConfig} from '@/lib/supabase/shared';

export function GET() {
  return NextResponse.json({status: 'ok', supabaseConfigured: hasSupabaseConfig});
}
