# ADHD Ace - Your Personal AI Productivity Assistant

ADHD Ace is a Next.js and Genkit-powered productivity assistant designed to help students—especially those with ADHD—manage their daily tasks, energy, and focus. It uses AI to generate personalized schedules and tips to support your mental flow.

---

## 🚀 Easy Installation (Recommended for Linux)

If you're on **Arch Linux** or a similar distribution, you can install and run ADHD Ace with one command:

```bash
bash <(curl -s https://raw.githubusercontent.com/Marrowdust/AdhdAce/main/install-adhdace.sh)
This script will:

Clone the repo

Prompt you for your Gemini API Key

Install dependencies

Set up a .env file

Create a launcher in your app menu

⚠️ Currently, the installer is tested and optimized for Arch Linux. Other distributions may work but are not officially supported yet.

🛠️ Manual Setup (Optional)
If you'd rather set things up yourself or you're on a non-Linux OS:

Prerequisites
Node.js (version 18 or later recommended)

npm (usually comes with Node.js)

A Google AI API Key (from Google AI Studio or Google Cloud Console)

Setup
Clone the repository:

bash
Copy
Edit
git clone https://github.com/Marrowdust/AdhdAce.git
cd AdhdAce
Install dependencies:

bash
Copy
Edit
npm install
Set up environment variables:

Create a new file named .env in the root of the project and add your Gemini API key:

env
Copy
Edit
GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY_HERE"
🧠 Running the Application (Manual)
Run both the backend (Genkit) and frontend (Next.js) in two separate terminals:

Start Genkit:

bash
Copy
Edit
npm run genkit:dev
Start Next.js:

bash
Copy
Edit
npm run dev
Visit the app:

Go to the address shown (usually http://localhost:9002).

✨ Features
Dynamic Daily Input: Enter your current energy, focus, and workload.

AI-Powered Schedule Generation: Get a daily plan broken into manageable tasks.

Personalized Tips: Receive advice tailored to your ADHD profile.

Progress Tracking: Log and visualize your productivity over time.

Achievements: Unlock consistency-based milestones.

Light/Dark Mode: Choose your visual preference.

Local Persistence: Saves your data in your browser storage.

Adaptive Learning (Conceptual): Over time, the AI gives smarter suggestions based on your logs.

🗂 Project Structure
src/app/: App pages and layouts

src/components/: UI components (ShadCN)

src/ai/: Genkit flows and AI integration

src/ai/flows/: AI logic and tasks

src/lib/: Utility functions and types

src/hooks/: Custom hooks

src/config/: App configs (e.g., achievements)

public/: Static assets (icons, etc.)

🧰 Tech Stack
Next.js (React framework)

TypeScript

Tailwind CSS

ShadCN UI

Genkit (Google AI)

Zod (Validation)

React Hook Form

Recharts

🤝 Contributing
This project is currently built for individual use, but contributions are welcome. If you'd like to collaborate, fork the repo and set up proper GitHub access to work on shared branches.

🔒 Privacy Note
Your API key is stored locally and never sent anywhere except to Google’s Gemini API via Genkit, strictly for generating your schedules.

yaml
Copy
Edit

---

Let me know if you’d like:
- A macOS or Windows section
- Installer link shown higher
- GIF/video demo badge
- A note for future `.deb` packages
