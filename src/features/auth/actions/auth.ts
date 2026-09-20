'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { magicLinkSchema, type MagicLinkInput } from '../schemas/auth-schema';
import type { ActionResponse } from '@/shared/types/action-response';

const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

export async function signInWithGoogle(): Promise<ActionResponse> {
  const supabase = await createClient();

  let redirectUrl: string;
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl },
    });

    if (error || !data.url) {
      return { error: error?.message ?? 'Unknown server error' };
    }

    redirectUrl = data.url;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown server error',
    };
  }

  redirect(redirectUrl);
}

export async function sendMagicLink(
  values: MagicLinkInput,
): Promise<ActionResponse> {
  const parsed = magicLinkSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Validation error' };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: { emailRedirectTo: callbackUrl },
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown server error',
    };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth');
}
