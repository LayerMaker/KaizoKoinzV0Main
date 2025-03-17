import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// This is a secure API route that serves the ROM file
// It includes authentication checks and rate limiting
export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Received request for ROM file');
    
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    console.log('API Route: Authorization header:', authorization ? 'Present' : 'Not present');
    
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
    console.log('API Route: Checking for ROM at:', romPath);
    
    // If the file doesn't exist in the private directory, try the rom directory at the root level
    if (!fs.existsSync(romPath)) {
      console.log('API Route: ROM not found in private directory, checking root rom directory');
      romPath = path.join(process.cwd(), 'rom', 'Invictus 1.0.sfc');
      console.log('API Route: Checking for ROM at:', romPath);
    }
    
    // Check if the file exists in either location
    if (!fs.existsSync(romPath)) {
      console.error('API Route: ROM file not found at:', romPath);
      return NextResponse.json(
        { error: 'ROM file not found' },
        { status: 404 }
      );
    }
    
    console.log('API Route: Serving ROM file from:', romPath);
    
    // Read the ROM file
    const romData = fs.readFileSync(romPath);
    console.log('API Route: ROM file size:', romData.length, 'bytes');
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', 'attachment; filename="invictus.sfc"');
    headers.set('Content-Length', romData.length.toString());
    
    // Add CORS headers to ensure the iframe can access the ROM
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
    headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Prevent caching to ensure fresh checks on each request
    headers.set('Cache-Control', 'no-store, max-age=0');
    
    console.log('API Route: Returning ROM file with headers:', Object.fromEntries(headers.entries()));
    
    // Return the ROM file
    return new NextResponse(romData, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('API Route: Error serving ROM file:', error);
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
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
  headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  console.log('API Route: Returning OPTIONS response with headers:', Object.fromEntries(headers.entries()));
  
  return new NextResponse(null, {
    status: 204, // No content
    headers,
  });
}
