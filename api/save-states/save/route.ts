import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// This API route handles saving game states
export async function POST(request: NextRequest) {
  try {
    // In a production environment, you would:
    // 1. Authenticate the user
    // 2. Verify they have permission to save for this game
    // 3. Rate limit save requests
    // 4. Validate the save data
    
    // Get the save state data from the request
    const saveData = await request.json();
    
    // Validate the save data
    if (!saveData || !saveData.gameId || !saveData.slot || !saveData.state) {
      return NextResponse.json(
        { error: 'Invalid save state data' },
        { status: 400 }
      );
    }
    
    // Create the save directory if it doesn't exist
    const saveDir = path.join(process.cwd(), 'private', 'saves', saveData.gameId);
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }
    
    // Save the state to a file
    const savePath = path.join(saveDir, `slot_${saveData.slot}.json`);
    fs.writeFileSync(savePath, JSON.stringify(saveData.state));
    
    console.log(`Saved state for game ${saveData.gameId} in slot ${saveData.slot}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving game state:', error);
    return NextResponse.json(
      { error: 'Failed to save game state' },
      { status: 500 }
    );
  }
}
