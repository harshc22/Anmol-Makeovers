import 'server-only';
import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

type Item = { quote: string; name: string };

async function fetchTestimonials(): Promise<Item[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('testimonials')
    .select('quote,name')
    .eq('published', true)
    .order('id', { ascending: false })
    .limit(18);

  if (error) {
    console.error('Testimonials fetch error:', error.message);
    return [];
  }
  return data ?? [];
}

// Cache the result for 24h (86400s)
export const getTestimonials = unstable_cache(fetchTestimonials, ['testimonials'], {
  revalidate: 86400,
});
