# Git Workflow for KaizoKoinz Project

## Mandatory User Approval Process

**CRITICAL: No code changes can be committed without explicit user approval.**

Before any Git operations that modify the repository:

1. **Demonstration of Changes**:
   - The agent must demonstrate that all new features work correctly
   - The agent must verify that existing functionality remains intact
   - Screenshots or videos should be provided when applicable

2. **Standardized Approval Request**:
   - The agent must use clear language: "Would you like me to commit these changes to the repository?"
   - The agent must specify exactly what will be committed
   - The agent must never assume approval or commit code autonomously

3. **Explicit User Permission**:
   - The user must respond with clear approval before any Git commands are executed
   - Approval must be for specific changes, not general permission
   - If the user requests modifications, the approval process must restart

4. **Post-Commit Verification**:
   - After committing, the agent must confirm the commit was successful
   - The agent must provide a summary of what was committed

This approval process is non-negotiable and applies to all Git operations that modify the repository.

## Save State Approach

This project uses a "save state" approach to version control, similar to save states in video games:

1. **Save States (Tags)**: Major milestones are tagged as save states
   - Example: `save-state1-KaizoKoin-Emulator+Rom+Wallet=correctly`
   - Each save state represents a stable, working version of the project

2. **Feature Branches**: New features are developed in isolated branches
   - Example: `feature/gamepad-calibration`
   - This keeps experimental code separate from stable code

## Commands for Managing Save States

### Creating a New Save State

```bash
# Make sure you're on the main branch with all changes committed
git checkout main

# Create a tag for the save state
git tag -a "save-state2-feature-description" -m "Save state 2: Description of what works"

# Push the tag to GitHub
git push origin "save-state2-feature-description"
```

### Starting Work on a New Feature

```bash
# Create a new branch from the latest save state
git checkout -b "feature/new-feature-name" main

# Work on your feature, making commits as needed
git add .
git commit -m "Description of changes"

# Push your feature branch to GitHub (optional)
git push origin "feature/new-feature-name"
```

### Completing a Feature

```bash
# Make sure your feature is fully tested and working

# Switch to main branch
git checkout main

# Merge your feature branch
git merge "feature/new-feature-name"

# Create a new save state if this is a major milestone
git tag -a "save-state3-with-new-feature" -m "Save state 3: New feature added"

# Push changes to GitHub
git push origin main
git push origin "save-state3-with-new-feature"
```

### Reverting to a Previous Save State

If something goes wrong and you need to go back to a previous stable state:

```bash
# View available save states
git tag -l

# Checkout the code at a specific save state
git checkout "save-state1-KaizoKoin-Emulator+Rom+Wallet=correctly"

# Create a new branch from this save state to continue work
git checkout -b "recovery-branch"
```

## Pre-Push Verification

Before pushing changes to GitHub:

1. Test the application thoroughly
2. Ensure all features are working as expected
3. Check for any console errors
4. Verify that the emulator, ROM loading, and wallet connections work

## Documentation

When creating a new save state, update:

1. The README.md file with the current state of the project
2. Any relevant documentation about new features
3. The list of known issues or limitations

This ensures that each save state is well-documented and can be returned to if needed.
