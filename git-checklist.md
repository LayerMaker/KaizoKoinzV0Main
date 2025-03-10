# Git Commit Checklist for KaizoKoinz Project

This checklist should be followed whenever you want to commit changes to the repository. It ensures that only stable, working code is committed and properly documented.

## User Approval Requirements

**MANDATORY: User approval is required before any Git operations.**

- [ ] User has been shown a demonstration of all changes
- [ ] User has verified that new features work correctly
- [ ] User has confirmed that existing functionality is not broken
- [ ] User has been asked explicitly: "Would you like me to commit these changes to the repository?"
- [ ] User has given clear, explicit approval for the specific changes
- [ ] The exact files to be committed have been listed for the user

Without explicit user approval, no Git commands should be executed. This is a non-negotiable requirement to protect code stability.

### Automated Approval Enforcement

The repository now includes Git hooks that enforce the user approval requirement:

1. **Pre-Commit and Pre-Push Hooks**: These hooks prevent any commit or push operation without explicit user approval.
2. **Approval Process**: Run `node approve-git-push.js` to grant approval for a Git operation.
3. **Time-Limited Approval**: Approvals expire after 5 minutes to prevent accidental or delayed operations.
4. **Single-Use Approval**: Each approval is automatically revoked after use.

This system ensures that no Git operations can be performed autonomously by the agent.

## Pre-Commit Checklist

Before committing any changes, verify that:

- [ ] The emulator loads and runs correctly
- [ ] ROM loading works properly
- [ ] Gamepad detection functions as expected
- [ ] Audio plays correctly
- [ ] Wallet connection works (if applicable to your changes)
- [ ] Any new features are fully tested and working
- [ ] There are no console errors or warnings
- [ ] Code is clean and follows project standards

## Commit Process

1. **Run the verification script**:
   ```bash
   node verify-before-push.js
   ```

2. **Stage your changes**:
   ```bash
   git add .
   ```

3. **Create a descriptive commit message**:
   ```bash
   git commit -m "Brief description of changes"
   ```

4. **Push to GitHub**:
   ```bash
   git push origin main
   ```

## Creating a New Save State

When you've reached a significant milestone:

1. **Create a tag for the save state**:
   ```bash
   git tag -a "save-state2-feature-description" -m "Save state 2: Description of what works"
   ```

2. **Push the tag to GitHub**:
   ```bash
   git push origin "save-state2-feature-description"
   ```

3. **Update documentation**:
   - Update README.md with the current state of the project
   - Document any new features or changes
   - Update any relevant documentation

## Prompt for Committing Changes

When you've completed a feature or made significant progress, ask yourself:

1. "Is this code stable and thoroughly tested?"
2. "Have I verified all core functionality still works?"
3. "Is this a good point to create a save state?"

If the answer to all these questions is "yes," follow the commit process above.

## Automated Verification

The `verify-before-push.js` script will:

1. Check for uncommitted changes
2. Run a build to check for compilation errors
3. Verify that all critical files are present
4. Show changes since the last commit

Always address any errors or warnings before proceeding with the commit.
