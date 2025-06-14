ADHD Ace - Your Personal AI Productivity Assistant
ADHD Ace is a Next.js and Genkit-powered productivity assistant designed to help students—especially those with ADHD—manage their daily tasks, energy, and focus. It uses AI to generate personalized schedules and tips to support your mental flow.

🚀 Easy Installation (Recommended for Linux)
If you're on Arch Linux or a similar distribution, you can install and run ADHD Ace with one command:

bash <(curl -s https://raw.githubusercontent.com/Marrowdust/AdhdAce/main/install-adhdace.sh)

This script will:

Clone the repo

Prompt you for your Gemini API Key (from Google AI Studio)

Install dependencies

Set up a .env file

Create a launcher in your app menu with an icon

Note: Currently, the installer is tested and optimized for Arch Linux. Other distributions may work but are not officially supported yet.

🛠️ Manual Setup (Optional)
If you're on a non-Arch distro or prefer manual control:

Prerequisites
Node.js (v18 or later)

npm (comes with Node.js)

A Google AI API Key

Setup
Clone the repository:

git clone https://github.com/Marrowdust/AdhdAce.git
cd AdhdAce

Install dependencies:

npm install

Set up environment variables:

Create a new file called .env in the root directory with the following content:

GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY_HERE"

Replace YOUR_GOOGLE_AI_API_KEY_HERE with your actual Gemini API key.

🧠 Running the Application
You need to start two services:

Start Genkit (AI logic server):

npm run genkit:dev

In another terminal, start the Next.js frontend:

npm run dev

Then open your browser at the address shown (typically http://localhost:9002).

✨ Features
Dynamic Daily Input: Log your current focus, energy, and workload.

AI-Powered Schedule: Get a custom daily plan based on your mental state.

Personalized Tips: Get smart advice based on ADHD science.

Progress Tracking: Visual logs of your completed days and tasks.

Achievements: Earn motivational badges for consistency.

Light/Dark Mode: Toggle themes as you wish.

Local Persistence: All data stays in your browser storage.

Adaptive Learning: Over time, the app becomes more personalized.

🗂 Project Structure
src/app/: App pages and layout (Next.js)

src/components/: Reusable UI components (ShadCN)

src/ai/: Genkit AI integration

flows/: Definitions for AI routines

genkit.ts: AI engine setup

src/lib/: Utility functions and types

src/hooks/: Custom React hooks

src/config/: Static configs like achievements

public/: Static files (images, icons, etc.)

🧰 Tech Stack
Next.js (React)

TypeScript

Tailwind CSS

ShadCN UI

Genkit (Google AI)

Zod (validation)

React Hook Form

Recharts (visual charts)

🤝 Contributing
ADHD Ace is currently designed for solo users. If you'd like to contribute or fork it for a team, ensure your Git/GitHub setup supports shared branches and PR workflows.

🔒 Privacy Note
Your API key is stored only in your local .env file. It is never shared or uploaded—only used for direct communication with Google's Gemini API.

