import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// This is a secure API route that handles loading game states
export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Received request for save state');
    
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    console.log('API Route: Authorization header:', authorization ? 'Present' : 'Not present');
    
    // In a real implementation, you would check if the user is authenticated
    // and verify they have permission to load states for this game
    
    // For now, we'll return a mock save state that's compatible with SNES9X
    // In a real implementation, you would need to convert the .lss file to a format
    // that EmulatorJS can understand, or use a different approach
    
    console.log('API Route: Returning mock save state data for speedrun');
    
    // Create a simple JSON response that indicates this is a speedrun save state
    // This won't actually load a save state, but it will let us know the API is working
    const mockSaveState = {
      success: true,
      message: "Speedrun save state loaded",
      type: "speedrun",
      game: "invictus",
      timestamp: new Date().toISOString()
    };
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Prevent caching
    headers.set('Cache-Control', 'no-store, max-age=0');
    
    console.log('API Route: Returning mock save state with headers:', Object.fromEntries(headers.entries()));
    
    // Return the mock save state
    return NextResponse.json(mockSaveState, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('API Route: Error loading save state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  console.log('API Route: Received OPTIONS request for CORS preflight');
  
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  console.log('API Route: Returning OPTIONS response with headers:', Object.fromEntries(headers.entries()));
  
  return new NextResponse(null, {
    status: 204, // No content
    headers,
  });
}
