import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AnalyticsEvent {
  event: string;
  properties: {
    section?: string;
    background?: string;
    experience?: string;
    timestamp: Date;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyticsEvent = await request.json();
    const { event, properties } = body;

    // Get session ID from headers or generate one
    const sessionId = request.headers.get('x-session-id') || 
      `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Insert analytics event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_name: event,
        properties: {
          ...properties,
          timestamp: new Date().toISOString()
        },
        session_id: sessionId
      });

    if (error) {
      console.error('Analytics error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to log event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event logged successfully'
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}