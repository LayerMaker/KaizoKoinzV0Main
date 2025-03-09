# Git Commit Checklist for KaizoKoinz Project

This checklist should be followed whenever you want to commit changes to the repository. It ensures that only stable, working code is committed and properly documented.

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
