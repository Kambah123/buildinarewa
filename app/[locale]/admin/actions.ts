'use server';

import {revalidatePath} from 'next/cache';
import {getViewer} from '@/lib/queries/account';
import {getAdminSupabase, getServerSupabase} from '@/lib/supabase/server';
import {sendSubmissionEmail} from '@/lib/email';
import {productEditSchema, reviewSchema} from '@/lib/validations/product';
import {listFields} from '@/lib/validations/product';

export type ReviewState = {status: 'idle' | 'error' | 'success'; message?: string};
export const initialReviewState: ReviewState = {status: 'idle'};

async function reviewerClient() {
  const viewer = await getViewer();
  if (!viewer || (viewer.role !== 'admin' && viewer.role !== 'editor')) return null;
  return {viewer, supabase: await getServerSupabase()};
}

async function submissionEmail(productId: string, status: 'approved' | 'rejected', reason?: string) {
  const service = getAdminSupabase();
  if (!service) return;
  const {data: product} = await service.from('products').select('name, submitted_by').eq('id', productId).maybeSingle();
  if (!product?.submitted_by) return;
  const {data: userResult} = await service.auth.admin.getUserById(product.submitted_by);
  if (userResult.user?.email) {
    await sendSubmissionEmail({to: userResult.user.email, productName: product.name, status, reason});
  }
}

export async function reviewProduct(
  locale: 'en' | 'ha',
  _: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const parsed = reviewSchema.safeParse({
    productId: formData.get('productId'),
    decision: formData.get('decision'),
    rejectionReason: formData.get('rejectionReason')
  });
  if (!parsed.success) return {status: 'error', message: parsed.error.issues[0]?.message ?? 'Check this review.'};

  const context = await reviewerClient();
  if (!context?.supabase) return {status: 'error', message: 'You do not have permission to review this listing.'};

  const update = {
    status: parsed.data.decision,
    rejection_reason: parsed.data.decision === 'rejected' ? parsed.data.rejectionReason : null,
    approved_by: context.viewer.id,
    launched_at: parsed.data.decision === 'rejected' ? null : new Date().toISOString()
  };
  const {error} = await context.supabase.from('products').update(update).eq('id', parsed.data.productId);
  if (error) return {status: 'error', message: error.message};

  if (parsed.data.decision === 'approved' || parsed.data.decision === 'rejected') {
    await submissionEmail(parsed.data.productId, parsed.data.decision, parsed.data.rejectionReason);
  }
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/products`);
  revalidatePath(`/${locale}`);
  return {status: 'success', message: parsed.data.decision === 'rejected' ? 'Listing rejected and maker notified.' : 'Listing is live in the directory.'};
}

export async function editAndApproveProduct(
  locale: 'en' | 'ha',
  _: ReviewState,
  formData: FormData
): Promise<ReviewState> {
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
  if (!parsed.success) return {status: 'error', message: parsed.error.issues[0]?.message ?? 'Check the fields before approving.'};

  const context = await reviewerClient();
  if (!context?.supabase) return {status: 'error', message: 'You do not have permission to review this listing.'};
  const {error} = await context.supabase
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
      tags: listFields(parsed.data.tags).slice(0, 5),
      status: 'approved',
      rejection_reason: null,
      approved_by: context.viewer.id,
      launched_at: new Date().toISOString()
    })
    .eq('id', parsed.data.productId);
  if (error) return {status: 'error', message: error.message};

  await submissionEmail(parsed.data.productId, 'approved');
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/products`);
  revalidatePath(`/${locale}`);
  return {status: 'success', message: 'Changes saved and listing approved.'};
}
