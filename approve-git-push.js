/**
 * Git Push Approval Script for KaizoKoinz Project
 * 
 * This script creates an approval token that allows a single git push operation.
 * It is used to enforce the requirement for explicit user approval before any
 * git push operations.
 * 
 * Usage: node approve-git-push.js
 * 
 * After running this script, you have 5 minutes to execute your git push command.
 * The approval token is automatically deleted after use or after expiration.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}=== KaizoKoinz Git Push Approval ====${colors.reset}\n`);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display the checklist from git-checklist.md
console.log(`${colors.yellow}=== Pre-Push Checklist ====${colors.reset}`);
console.log(`${colors.yellow}Please verify the following before approving:${colors.reset}`);
console.log(`  - The emulator loads and runs correctly`);
console.log(`  - ROM loading works properly`);
console.log(`  - Gamepad detection functions as expected`);
console.log(`  - Audio plays correctly`);
console.log(`  - Wallet connection works (if applicable to your changes)`);
console.log(`  - Any new features are fully tested and working`);
console.log(`  - There are no console errors or warnings`);
console.log(`  - Code is clean and follows project standards`);
console.log(`  - You have run: node verify-before-push.js\n`);

// Ask for confirmation
rl.question(`${colors.red}Do you explicitly approve the git push operation? (yes/no): ${colors.reset}`, (answer) => {
  if (answer.toLowerCase() === 'yes') {
    // Create the approval file
    const approvalFile = path.join('.git', 'user_approval.txt');
    
    try {
      // Write the current timestamp to the approval file
      fs.writeFileSync(approvalFile, new Date().toISOString());
      
      console.log(`\n${colors.green}✓ Push approval granted!${colors.reset}`);
      console.log(`${colors.green}✓ You may now execute your git push command.${colors.reset}`);
      console.log(`${colors.yellow}Note: This approval expires in 5 minutes.${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}ERROR: Failed to create approval file.${colors.reset}`);
      console.error(`${colors.red}${error.message}${colors.reset}`);
    }
  } else {
    console.log(`\n${colors.red}Push operation not approved.${colors.reset}`);
    console.log(`${colors.red}No changes will be pushed to the repository.${colors.reset}`);
  }
  
  rl.close();
});

// Display additional information when closing
rl.on('close', () => {
  console.log(`\n${colors.cyan}=== Git Push Approval Process ====${colors.reset}`);
  console.log(`1. Run this script to grant approval: ${colors.yellow}node approve-git-push.js${colors.reset}`);
  console.log(`2. Execute your git push command: ${colors.yellow}git push origin main${colors.reset}`);
  console.log(`3. The approval is automatically revoked after use or after 5 minutes.\n`);
  
  console.log(`${colors.magenta}REMINDER: This approval system is designed to prevent autonomous git operations.${colors.reset}`);
  console.log(`${colors.magenta}All git operations that modify the repository require explicit user approval.${colors.reset}`);
  
  console.log(`\n${colors.cyan}=== End of Approval Process ====${colors.reset}`);
});
