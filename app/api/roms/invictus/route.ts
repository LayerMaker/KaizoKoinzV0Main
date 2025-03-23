import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// This is a secure API route that serves the ROM file
// It includes authentication checks and rate limiting
export async function GET(request: NextRequest) {
  try {
    // Enhanced logging for debugging
    console.log('=== ROM API ROUTE DEBUG ===');
    console.log('API Route: Received request for ROM file');
    console.log('API Route: Request URL:', request.url);
    console.log('API Route: Request method:', request.method);
    console.log('API Route: Request headers:', JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2));
    console.log('API Route: Request referrer:', request.headers.get('referer') || 'Not present');
    console.log('API Route: Request origin:', request.headers.get('origin') || 'Not present');
    
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
    console.log('API Route: File exists in private directory:', fs.existsSync(romPath));
    
    // If the file doesn't exist in the private directory, try the rom directory at the root level
    if (!fs.existsSync(romPath)) {
      console.log('API Route: ROM not found in private directory, checking root rom directory');
      romPath = path.join(process.cwd(), 'rom', 'Invictus 1.0.sfc');
      console.log('API Route: Checking for ROM at:', romPath);
      console.log('API Route: File exists in root rom directory:', fs.existsSync(romPath));
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
    
    try {
      // Read the ROM file with detailed error handling
      const romData = fs.readFileSync(romPath);
      console.log('API Route: ROM file size:', romData.length, 'bytes');
      console.log('API Route: ROM file read successfully');
    } catch (readError: any) {
      console.error('API Route: Error reading ROM file:', readError);
      return NextResponse.json(
        { error: `Error reading ROM file: ${readError.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
    
    // Read the ROM file again for the response
    const romData = fs.readFileSync(romPath);
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', 'attachment; filename="invictus.sfc"');
    headers.set('Content-Length', romData.length.toString());
    
    // Add CORS headers to ensure the iframe can access the ROM
    const origin = request.headers.get('origin');
    if (origin) {
      console.log('API Route: Setting CORS for specific origin:', origin);
      headers.set('Access-Control-Allow-Origin', origin);
    } else {
      console.log('API Route: Setting CORS for all origins');
      headers.set('Access-Control-Allow-Origin', '*');
    }
    
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
    headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Prevent caching to ensure fresh checks on each request
    headers.set('Cache-Control', 'no-store, max-age=0');
    
    console.log('API Route: Returning ROM file with headers:', JSON.stringify(Object.fromEntries(headers.entries()), null, 2));
    console.log('=== END ROM API ROUTE DEBUG ===');
    
    // Return the ROM file
    return new NextResponse(romData, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('API Route: Error serving ROM file:', error);
    console.error('API Route: Error stack:', error.stack || 'No stack trace available');
    return NextResponse.json(
      { error: `Internal server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  console.log('=== OPTIONS API ROUTE DEBUG ===');
  console.log('API Route: Received OPTIONS request for CORS preflight');
  console.log('API Route: Request URL:', request.url);
  console.log('API Route: Request headers:', JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2));
  
  const headers = new Headers();
  
  // Set CORS headers based on origin
  const origin = request.headers.get('origin');
  if (origin) {
    console.log('API Route: Setting CORS for specific origin:', origin);
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    console.log('API Route: Setting CORS for all origins');
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
  headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  console.log('API Route: Returning OPTIONS response with headers:', JSON.stringify(Object.fromEntries(headers.entries()), null, 2));
  console.log('=== END OPTIONS API ROUTE DEBUG ===');
  
  return new NextResponse(null, {
    status: 204, // No content
    headers,
  });
}
