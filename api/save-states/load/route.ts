import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// This API route handles loading game states
export async function GET(request: NextRequest) {
  try {
    // In a production environment, you would:
    // 1. Authenticate the user
    // 2. Verify they have permission to load saves for this game
    // 3. Rate limit load requests
    
    // Get the game ID and slot from the URL parameters
    const url = new URL(request.url);
    const gameId = url.searchParams.get('gameId');
    const slot = url.searchParams.get('slot');
    
    // Validate the parameters
    if (!gameId || !slot) {
      return NextResponse.json(
        { error: 'Missing gameId or slot parameter' },
        { status: 400 }
      );
    }
    
    // Path to the save file
    const savePath = path.join(process.cwd(), 'private', 'saves', gameId, `slot_${slot}.json`);
    
    // Check if the save file exists
    if (!fs.existsSync(savePath)) {
      return NextResponse.json(
        { error: 'Save state not found' },
        { status: 404 }
      );
    }
    
    // Read the save file
    const saveData = fs.readFileSync(savePath, 'utf-8');
    
    console.log(`Loaded state for game ${gameId} from slot ${slot}`);
    
    // Return the save state
    return NextResponse.json(JSON.parse(saveData));
  } catch (error) {
    console.error('Error loading game state:', error);
    return NextResponse.json(
      { error: 'Failed to load game state' },
      { status: 500 }
    );
  }
}
