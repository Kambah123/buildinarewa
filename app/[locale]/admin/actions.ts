'use server';

import {revalidatePath} from 'next/cache';
import {getViewer} from '@/lib/queries/account';
import {getAdminSupabase, getServerSupabase} from '@/lib/supabase/server';
import {sendSubmissionEmail} from '@/lib/email';
import {builderSchema, listFields, productEditSchema, reviewSchema, storySchema} from '@/lib/validations/product';
import {toSlug} from '@/lib/utils';

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

export async function createBuilder(
  locale: 'en' | 'ha',
  _: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const parsed = builderSchema.safeParse({
    name: formData.get('name'), headline: formData.get('headline'), bioEn: formData.get('bioEn'), bioHa: formData.get('bioHa'),
    state: formData.get('state'), website: formData.get('website'), x: formData.get('x'), linkedin: formData.get('linkedin'), photoUrl: formData.get('photoUrl')
  });
  if (!parsed.success) return {status: 'error', message: parsed.error.issues[0]?.message ?? 'Check the builder profile fields.'};
  const context = await reviewerClient();
  if (!context?.supabase) return {status: 'error', message: 'You do not have permission to manage builders.'};
  const baseSlug = toSlug(parsed.data.name);
  if (!baseSlug) return {status: 'error', message: 'Use a name containing letters or numbers.'};
  let slug = baseSlug;
  const {data: existing} = await context.supabase.from('builders').select('id').eq('slug', slug).maybeSingle();
  if (existing) slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;
  const {error} = await context.supabase.from('builders').insert({
    slug, name: parsed.data.name, headline: parsed.data.headline, bio_en: parsed.data.bioEn, bio_ha: parsed.data.bioHa || null,
    state: parsed.data.state || null, photo_url: parsed.data.photoUrl || null,
    links: {website: parsed.data.website || null, x: parsed.data.x || null, linkedin: parsed.data.linkedin || null}, is_seed: false
  });
  if (error) return {status: 'error', message: error.message};
  revalidatePath(`/${locale}/builders`);
  revalidatePath(`/${locale}/admin/builders`);
  revalidatePath(`/${locale}`);
  return {status: 'success', message: 'Builder profile created.'};
}

export async function createStory(
  locale: 'en' | 'ha',
  _: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const parsed = storySchema.safeParse({
    builderId: formData.get('builderId'), titleEn: formData.get('titleEn'), titleHa: formData.get('titleHa'),
    excerptEn: formData.get('excerptEn'), excerptHa: formData.get('excerptHa'), bodyEn: formData.get('bodyEn'), bodyHa: formData.get('bodyHa'),
    coverUrl: formData.get('coverUrl'), videoUrl: formData.get('videoUrl'), publish: formData.get('publish')
  });
  if (!parsed.success) return {status: 'error', message: parsed.error.issues[0]?.message ?? 'Check the story fields.'};
  const context = await reviewerClient();
  if (!context?.supabase) return {status: 'error', message: 'You do not have permission to manage stories.'};
  const baseSlug = toSlug(parsed.data.titleEn);
  if (!baseSlug) return {status: 'error', message: 'Use a title containing letters or numbers.'};
  let slug = baseSlug;
  const {data: existing} = await context.supabase.from('stories').select('id').eq('slug', slug).maybeSingle();
  if (existing) slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;
  const published = parsed.data.publish === 'true';
  const {error} = await context.supabase.from('stories').insert({
    slug, builder_id: parsed.data.builderId ?? null, title_en: parsed.data.titleEn, title_ha: parsed.data.titleHa || null,
    excerpt_en: parsed.data.excerptEn, excerpt_ha: parsed.data.excerptHa || null, body_en: parsed.data.bodyEn, body_ha: parsed.data.bodyHa || null,
    cover_url: parsed.data.coverUrl || null, video_url: parsed.data.videoUrl || null,
    status: published ? 'published' : 'draft', published_at: published ? new Date().toISOString() : null, is_seed: false
  });
  if (error) return {status: 'error', message: error.message};
  revalidatePath(`/${locale}/stories`);
  revalidatePath(`/${locale}/admin/stories`);
  revalidatePath(`/${locale}`);
  return {status: 'success', message: published ? 'Story published.' : 'Story saved as a draft.'};
}
