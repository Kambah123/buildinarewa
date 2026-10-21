'use server';

import {revalidatePath} from 'next/cache';
import {getServerSupabase} from '@/lib/supabase/server';
import {getCategories, getStates} from '@/lib/queries/catalog';
import {sendSubmissionEmail} from '@/lib/email';
import {imageFileSchema, listFields, parseSubmissionForm} from '@/lib/validations/product';
import {toSlug} from '@/lib/utils';

type SubmissionState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fields?: Record<string, string>;
  productName?: string;
};

export const initialSubmissionState: SubmissionState = {status: 'idle'};

function getFile(formData: FormData, name: string) {
  const value = formData.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({secret, response: token});
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    cache: 'no-store'
  });
  const result = (await response.json()) as {success?: boolean};
  return result.success === true;
}

async function uploadAsset(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabase>>>,
  userId: string,
  productId: string,
  file: File,
  kind: string
) {
  const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
  const path = `${userId}/${productId}/${kind}-${crypto.randomUUID()}.${extension}`;
  const {error} = await supabase.storage.from('product-assets').upload(path, file, {
    contentType: file.type,
    upsert: false
  });
  if (error) throw new Error(`Could not upload ${kind}. ${error.message}`);
  return path;
}

export async function submitProduct(
  locale: 'en' | 'ha',
  _: SubmissionState,
  formData: FormData
): Promise<SubmissionState> {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return {status: 'error', message: 'Submissions need Supabase configuration. Add the values from .env.example first.'};
  }

  const {data: {user}} = await supabase.auth.getUser();
  if (!user) return {status: 'error', message: 'Please sign in before submitting a product.'};

  let values;
  try {
    values = parseSubmissionForm(formData);
  } catch (error) {
    const fields: Record<string, string> = {};
    if (error instanceof Error && 'issues' in error) {
      for (const issue of (error as {issues: Array<{path: PropertyKey[]; message: string}>}).issues) {
        fields[String(issue.path[0])] = issue.message;
      }
    }
    return {status: 'error', message: 'Please correct the highlighted fields.', fields};
  }

  const logo = getFile(formData, 'logo');
  const cover = getFile(formData, 'cover');
  const screenshots = formData.getAll('screenshots').filter((item): item is File => item instanceof File && item.size > 0);

  if (!logo || !cover) {
    return {status: 'error', message: 'A logo and cover image are required.', fields: {logo: 'Add a logo.', cover: 'Add a cover image.'}};
  }

  try {
    imageFileSchema.parse({type: logo.type, size: logo.size});
    imageFileSchema.parse({type: cover.type, size: cover.size});
    screenshots.slice(0, 4).forEach((file) => imageFileSchema.parse({type: file.type, size: file.size}));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Check your image files.';
    return {status: 'error', message, fields: {logo: message}};
  }

  const validTurnstile = await verifyTurnstile(values.turnstileToken);
  if (!validTurnstile) return {status: 'error', message: 'Please complete the spam verification.', fields: {turnstileToken: 'Verification is required.'}};

  const [categories, states] = await Promise.all([getCategories(), getStates()]);
  const category = categories.find((item) => item.slug === values.category);
  const state = states.find((item) => item.code === values.state);
  if (!category || !state) return {status: 'error', message: 'Choose a valid category and state.'};

  const baseSlug = toSlug(values.name);
  if (!baseSlug) return {status: 'error', message: 'Use a product name with letters or numbers.'};

  let slug = baseSlug;
  const {data: existing} = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
  if (existing) slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

  const productId = crypto.randomUUID();
  try {
    const logoUrl = await uploadAsset(supabase, user.id, productId, logo, 'logo');
    const coverUrl = await uploadAsset(supabase, user.id, productId, cover, 'cover');
    const screenshotUrls = await Promise.all(screenshots.slice(0, 4).map((file, index) => uploadAsset(supabase, user.id, productId, file, `screenshot-${index + 1}`)));

    const {error} = await supabase.from('products').insert({
      id: productId,
      slug,
      name: values.name,
      tagline_en: values.taglineEn,
      tagline_ha: values.taglineHa || null,
      description_en: values.descriptionEn,
      description_ha: values.descriptionHa || null,
      logo_url: logoUrl,
      cover_url: coverUrl,
      screenshots: screenshotUrls,
      website_url: values.website,
      category_id: category.id,
      state: state.code,
      city: values.city,
      stage: values.stage,
      funding: values.funding,
      alternative_to: listFields(values.alternatives),
      tags: listFields(values.tags).slice(0, 5),
      status: 'pending',
      submitted_by: user.id,
      is_seed: false
    });
    if (error) throw new Error(error.message);

    const {error: makerError} = await supabase.from('product_makers').insert({
      product_id: productId,
      profile_id: user.id,
      role: values.makerRole
    });
    if (makerError) throw new Error(makerError.message);
  } catch (error) {
    return {status: 'error', message: error instanceof Error ? error.message : 'We could not save the submission. Please try again.'};
  }

  if (user.email) await sendSubmissionEmail({to: user.email, productName: values.name, status: 'received'});
  revalidatePath(`/${locale}/me`);
  revalidatePath(`/${locale}/admin`);
  return {status: 'success', productName: values.name};
}
