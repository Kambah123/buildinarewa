'use server';

import {revalidatePath} from 'next/cache';
import {getViewer} from '@/lib/queries/account';
import {getServerSupabase} from '@/lib/supabase/server';
import {listFields, productEditSchema} from '@/lib/validations/product';

export type PendingEditState = {status: 'idle' | 'error' | 'success'; message?: string};
export const initialPendingEditState: PendingEditState = {status: 'idle'};

export async function updatePendingProduct(
  locale: 'en' | 'ha',
  slug: string,
  _: PendingEditState,
  formData: FormData
): Promise<PendingEditState> {
  const parsed = productEditSchema.safeParse({
    productId: formData.get('productId'),
    name: formData.get('name'),
    taglineEn: formData.get('taglineEn'),
    descriptionEn: formData.get('descriptionEn'),
    category: formData.get('category'),
    state: formData.get('state'),
    city: formData.get('city'),
    stage: formData.get('stage'),
    funding: formData.get('funding'),
    alternatives: formData.get('alternatives'),
    tags: formData.get('tags')
  });
  if (!parsed.success) return {status: 'error', message: parsed.error.issues[0]?.message ?? 'Check the form and try again.'};

  const [viewer, supabase] = await Promise.all([getViewer(), getServerSupabase()]);
  if (!viewer || !supabase) return {status: 'error', message: 'Please sign in again before editing this listing.'};
  const {error} = await supabase
    .from('products')
    .update({
      name: parsed.data.name,
      tagline_en: parsed.data.taglineEn,
      description_en: parsed.data.descriptionEn,
      category_id: parsed.data.category,
      state: parsed.data.state,
      city: parsed.data.city,
      stage: parsed.data.stage,
      funding: parsed.data.funding,
      alternative_to: listFields(parsed.data.alternatives),
      tags: listFields(parsed.data.tags).slice(0, 5)
    })
    .eq('id', parsed.data.productId)
    .eq('slug', slug)
    .eq('submitted_by', viewer.id)
    .eq('status', 'pending');
  if (error) return {status: 'error', message: error.message};

  revalidatePath(`/${locale}/me`);
  revalidatePath(`/${locale}/me/${slug}/edit`);
  return {status: 'success', message: 'Your pending submission has been updated.'};
}
