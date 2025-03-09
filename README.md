# KaizoKoinzV0Main

A retro gaming platform with SNES emulation and cryptocurrency wallet integration.

## Project Overview

This project combines retro gaming nostalgia with modern cryptocurrency functionality, allowing users to:
- Play SNES games through browser-based emulation
- Connect cryptocurrency wallets
- Earn rewards through gameplay achievements

## Development Approach

This repository uses a "save state" approach to version control:

- **Save States**: Major milestones are tagged as save states (e.g., "save-state1", "save-state2")
- **Feature Branches**: New features are developed in dedicated branches
- **Testing**: All code is thoroughly tested before being merged to main branch

## Current Save State

**save-state1-KaizoKoin-Emulator+Rom+Wallet=correctly**
- Working SNES emulator implementation
- ROM loading functionality
- Wallet connection
- Basic UI integration

## Setup Instructions

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Navigate to `localhost:3000` in your browser

## Technology Stack

- Next.js
- EmulatorJS for SNES emulation
- Web3 wallet integration
- Tailwind CSS for styling

## Git Workflow

When working on new features:
1. Create a new branch from the latest save state
2. Implement and test the feature
3. Create a pull request for review
4. After approval, merge to main and create a new save state if appropriate

## License

Private repository - all rights reserved.
