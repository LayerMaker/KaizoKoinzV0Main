/**
 * Pre-Push Verification Script for KaizoKoinz Project
 * 
 * This script performs basic checks to verify that the code is in a stable state
 * before pushing to GitHub. It checks for:
 * 
 * 1. Compilation errors
 * 2. Basic functionality
 * 3. Summary of changes since last commit
 * 
 * Usage: node verify-before-push.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

console.log(`${colors.cyan}=== KaizoKoinz Pre-Push Verification ====${colors.reset}\n`);

// Track overall status
let hasErrors = false;
let hasWarnings = false;

// Function to run a command and return its output
function runCommand(command, errorMessage) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(`${colors.red}ERROR: ${errorMessage}${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    hasErrors = true;
    return null;
  }
}

// Check 1: Git status - make sure there are no uncommitted changes
console.log(`${colors.blue}Checking Git status...${colors.reset}`);
const gitStatus = runCommand('git status --porcelain', 'Failed to check Git status');

if (gitStatus && gitStatus.trim() !== '') {
  console.log(`${colors.yellow}WARNING: You have uncommitted changes:${colors.reset}`);
  console.log(gitStatus);
  hasWarnings = true;
} else if (gitStatus) {
  console.log(`${colors.green}✓ No uncommitted changes${colors.reset}`);
}

// Check 2: Run Next.js build to check for compilation errors
console.log(`\n${colors.blue}Checking for compilation errors...${colors.reset}`);
const buildOutput = runCommand('npm run build', 'Build failed');

if (buildOutput) {
  console.log(`${colors.green}✓ Build successful${colors.reset}`);
}

// Check 3: Check for critical files
console.log(`\n${colors.blue}Checking for critical files...${colors.reset}`);
const criticalFiles = [
  'emulator-section.tsx',
  'app/page.tsx',
  'app/layout.tsx',
  'api/roms/invictus/route.ts',
  'api/save-states/save/route.ts',
  'api/save-states/load/route.ts'
];

let missingFiles = [];
for (const file of criticalFiles) {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
  }
}

if (missingFiles.length > 0) {
  console.log(`${colors.red}ERROR: Missing critical files:${colors.reset}`);
  missingFiles.forEach(file => console.log(`  - ${file}`));
  hasErrors = true;
} else {
  console.log(`${colors.green}✓ All critical files present${colors.reset}`);
}

// Check 4: Show changes since last commit
console.log(`\n${colors.blue}Changes since last commit:${colors.reset}`);
const lastCommit = runCommand('git log -1 --pretty=%B', 'Failed to get last commit message');
if (lastCommit) {
  console.log(`Last commit: ${lastCommit.trim()}`);
}

const diffStat = runCommand('git diff --stat', 'Failed to get diff stats');
if (diffStat && diffStat.trim() !== '') {
  console.log(diffStat);
} else if (diffStat) {
  console.log('No changes since last commit.');
}

// Final summary
console.log(`\n${colors.cyan}=== Verification Summary ====${colors.reset}`);
if (hasErrors) {
  console.log(`${colors.red}✗ Verification FAILED. Please fix the errors before pushing.${colors.reset}`);
} else if (hasWarnings) {
  console.log(`${colors.yellow}⚠ Verification PASSED WITH WARNINGS. Review warnings before pushing.${colors.reset}`);
} else {
  console.log(`${colors.green}✓ Verification PASSED. Your code looks good to push!${colors.reset}`);
}

// Reminder about manual testing
console.log(`\n${colors.magenta}REMINDER: This script cannot verify actual functionality.${colors.reset}`);
console.log(`${colors.magenta}Please manually test the following before pushing:${colors.reset}`);
console.log(`  - Emulator loads and runs correctly`);
console.log(`  - ROM loads properly`);
console.log(`  - Gamepad detection works`);
console.log(`  - Audio plays correctly`);
console.log(`  - Wallet connection functions properly`);

console.log(`\n${colors.cyan}=== End of Verification ====${colors.reset}`);

// Exit with appropriate code
process.exit(hasErrors ? 1 : 0);
