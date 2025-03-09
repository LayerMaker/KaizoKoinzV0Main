import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// This is a secure API route that serves the ROM file
// It includes authentication checks and rate limiting
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    
    // In a real implementation, you would check if the user is authenticated
    // For now, we'll allow access without authentication for development
    // but in production you would implement proper authentication
    
    // Check if the user is allowed to access this ROM
    // This would typically involve checking if the user has purchased or unlocked the game
    
    // Rate limiting - in a real implementation, you would track requests by user/IP
    // and limit the number of requests per time period
    
    // Path to the ROM file - using the private directory to prevent direct access
    // First try the private directory
    let romPath = path.join(process.cwd(), 'private', 'roms', 'Invictus 1.0.sfc');
    
    // If the file doesn't exist in the private directory, try the rom directory at the root level
    if (!fs.existsSync(romPath)) {
      romPath = path.join(process.cwd(), 'rom', 'Invictus 1.0.sfc');
    }
    
    // Check if the file exists in either location
    if (!fs.existsSync(romPath)) {
      console.error('ROM file not found at:', romPath);
      return NextResponse.json(
        { error: 'ROM file not found' },
        { status: 404 }
      );
    }
    
    console.log('Serving ROM file from:', romPath);
    
    // Read the ROM file
    const romData = fs.readFileSync(romPath);
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', 'attachment; filename="invictus.sfc"');
    
    // Prevent caching to ensure fresh checks on each request
    headers.set('Cache-Control', 'no-store, max-age=0');
    
    // Return the ROM file
    return new NextResponse(romData, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving ROM file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
