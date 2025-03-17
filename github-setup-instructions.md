# GitHub Setup Instructions for KaizoKoinz Project

## GitHub Account Information

- **Username:** LayerMaker
- **Email:** fightclubgarmz@gmail.com
- **Repository:** https://github.com/LayerMaker/KaizoKoinzV0Main/branches

## Important Guidelines

**CRITICAL: These GitHub credentials should ONLY be used when explicitly requested by the user.**

1. **Never suggest pushing to GitHub** - Only activate the push process if the user has specifically requested it
2. **Always push to a new branch** - Never push directly to the main branch
3. **Use descriptive branch names** - Branch names should clearly indicate the feature or fix being implemented
4. **Document all changes** - Include detailed commit messages and update relevant documentation

## Git Configuration Commands

### Setting up Git credentials

```bash
git config --global user.name "LayerMaker"
git config --global user.email "fightclubgarmz@gmail.com"
```

### Creating and pushing to a new branch

```bash
# Create a new branch
git checkout -b "branch-name"

# Add modified files
git add .

# Commit changes with a descriptive message
git commit -m "Description of changes"

# Push to the new branch
git push -u origin "branch-name"
```

## Branch Naming Conventions

- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-description`
- Improvement branches: `improvement/description`
- Refactor branches: `refactor/component-name`

## Pull Request Process

1. Push changes to a new branch
2. Go to the repository on GitHub
3. Click "Compare & pull request"
4. Add a title and description for the pull request
5. Request a review if applicable
6. Click "Create pull request"

## Save State Approach

This project uses a "save state" approach to version control, similar to save states in video games. See `git-workflow.md` for more details on:

- Creating and managing save states (Git tags)
- Working with feature branches
- Merging completed features
- Reverting to previous save states if needed
