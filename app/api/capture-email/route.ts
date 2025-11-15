import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface EmailCaptureRequest {
  email: string;
  type: 'download' | 'ai_interest';
  resumeMetadata?: {
    sections: string[];
    background: string;
    experience: string;
  };
}

export interface EmailCaptureResponse {
  success: boolean;
  message: string;
  downloadToken?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailCaptureRequest = await request.json();
    const { email, type, resumeMetadata } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('email_captures')
      .select('email')
      .eq('email', email)
      .eq('capture_type', type)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email already registered for this service' },
        { status: 409 }
      );
    }

    // Insert new email capture
    const { error } = await supabase
      .from('email_captures')
      .insert({
        email,
        capture_type: type,
        resume_metadata: resumeMetadata,
        source: 'chatbot'
      });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to save email' },
        { status: 500 }
      );
    }

    // Generate download token for PDF downloads
    const downloadToken = type === 'download' ? 
      Buffer.from(`${email}-${Date.now()}`).toString('base64') : 
      undefined;

    return NextResponse.json({
      success: true,
      message: type === 'download' ? 
        'Email captured successfully. Generating PDF...' : 
        'Thank you for your interest! We\'ll notify you when the AI service is ready.',
      downloadToken
    });

  } catch (error) {
    console.error('Email capture error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}