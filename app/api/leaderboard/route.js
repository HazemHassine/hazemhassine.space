import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import filter from 'leo-profanity';

// GET /api/leaderboard?mode=space_shooter&limit=15
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'space_shooter';
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '15', 10)));

    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Supabase is not configured yet. Run the SQL script in Supabase SQL editor to enable the global leaderboard.',
      });
    }

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('leaderboard')
      .select('id, created_at, player_name, score, game_mode, sector')
      .eq('game_mode', mode)
      .order('score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard from Supabase:', error);
      return NextResponse.json(
        { success: false, error: error.message, data: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    console.error('Leaderboard GET error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve leaderboard', data: [] },
      { status: 500 }
    );
  }
}

// POST /api/leaderboard
export async function POST(request) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    let { player_name, score, game_mode, sector } = body;

    // Validation & Sanitization
    if (!player_name || typeof player_name !== 'string') {
      player_name = 'ANONYMOUS';
    }

    // Clean callsign: uppercase, alphanumeric, max 16 chars
    const sanitizedName = player_name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_\- ]/g, '')
      .slice(0, 16) || 'PILOT';

    // Profanity Filter check using leo-profanity
    if (filter.check(sanitizedName)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Callsign contains prohibited words. Please choose a suitable callsign.',
        },
        { status: 400 }
      );
    }

    const numericScore = parseInt(score, 10);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 10000000) {
      return NextResponse.json(
        { success: false, error: 'Invalid score value' },
        { status: 400 }
      );
    }

    const validModes = ['grid_runner', 'space_shooter'];
    const validMode = validModes.includes(game_mode) ? game_mode : 'space_shooter';
    const numericSector = Math.max(1, parseInt(sector, 10) || 1);

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('leaderboard')
      .insert([
        {
          player_name: sanitizedName,
          score: numericScore,
          game_mode: validMode,
          sector: numericSector,
        },
      ])
      .select('id, created_at, player_name, score, game_mode, sector')
      .single();

    if (error) {
      console.error('Error inserting leaderboard entry:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Calculate the player's rank
    const { count } = await client
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .eq('game_mode', validMode)
      .gt('score', numericScore);

    const rank = (count || 0) + 1;

    return NextResponse.json({
      success: true,
      data,
      rank,
    });
  } catch (err) {
    console.error('Leaderboard POST error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to record score' },
      { status: 500 }
    );
  }
}
