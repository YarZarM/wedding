import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { supabaseAdmin } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Name and email are required' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data: rsvpData, error } = await supabaseAdmin
      .from('rsvps')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        guests: data.guests,
        attending: data.attending,
        message: data.message || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to save RSVP. Please try again.' 
        },
        { status: 500 }
      );
    }

    console.log('RSVP saved successfully:', rsvpData);

    // TODO: Send confirmation email
    // await sendConfirmationEmail(data.email, data.name);

    return NextResponse.json({ 
      success: true, 
      message: 'RSVP submitted successfully',
      data: rsvpData
    });
  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Optional: Get all RSVPs (for admin dashboard)
export async function GET() {
  try {
    const { data: rsvps, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true,
      rsvps: rsvps || []
    });
  } catch (error) {
    console.error('Fetch RSVPs error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch RSVPs' 
      },
      { status: 500 }
    );
  }
}