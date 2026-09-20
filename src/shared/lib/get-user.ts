import { createClient } from '@/shared/lib/supabase/server';

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { data: null, error: error?.message ?? 'Unauthorized' };
  }

  return { data: user, error: null };
}
