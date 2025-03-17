#!/usr/bin/env node

/**
 * Script to approve git operations for KaizoKoinz project
 * This creates the approval file required by the pre-commit and pre-push hooks
 */

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
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}=== KaizoKoinz Git Operation Approval ===${colors.reset}`);
console.log('');

// Create the approval file
const approvalFile = path.join('.git', 'user_approval.txt');
const approvalContent = `Approved by user at: ${new Date().toISOString()}`;

try {
  fs.writeFileSync(approvalFile, approvalContent);
  console.log(`${colors.green}✓ Git operation approved successfully.${colors.reset}`);
  console.log(`${colors.green}✓ Approval is valid for 5 minutes.${colors.reset}`);
  console.log('');
  console.log(`${colors.yellow}You may now proceed with your git commit and push operations.${colors.reset}`);
} catch (error) {
  console.log(`${colors.red}ERROR: Failed to create approval file.${colors.reset}`);
  console.log(`${colors.red}Details: ${error.message}${colors.reset}`);
  console.log('');
  console.log(`${colors.yellow}Please ensure you have write permissions to the .git directory.${colors.reset}`);
  process.exit(1);
}
