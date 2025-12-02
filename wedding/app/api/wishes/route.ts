import { supabaseAdmin } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';
// Import your database client (Prisma, Supabase, etc.)

export async function GET() {
  try {
    const { data: wishes, error } = await supabaseAdmin
      .from('rsvps')
      .select('id, name, message, created_at')
      .not('message', 'is', null)
      .neq('message', '')
      // Optional: Add approval filter if you want moderation
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch wishes' }, { status: 500 });
    }

    // Transform data to match component expectations
    const transformedWishes = wishes.map(wish => ({
      id: wish.id,
      name: wish.name,
      message: wish.message,
      createdAt: wish.created_at
    }));

    return NextResponse.json(transformedWishes);
  } catch (error) {
    console.error('Failed to fetch wishes:', error);
    return NextResponse.json({ error: 'Failed to fetch wishes' }, { status: 500 });
  }
}
