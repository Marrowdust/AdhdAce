# ADHD Ace - Your Personal AI Productivity Assistant

This is a Next.js and Genkit application designed to help students, especially those with ADHD, manage their daily tasks, energy, and focus. It provides personalized schedules and tips powered by AI.

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

*   Node.js (version 18 or later recommended)
*   npm (usually comes with Node.js)
*   A Google AI API Key (from Google AI Studio or Google Cloud Console)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    *   Create a new file named `.env` in the root of your project. You can copy the example file:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and add your Google AI API Key:
        ```
        GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY_HERE"
        ```
        Replace `"YOUR_GOOGLE_AI_API_KEY_HERE"` with your actual API key.

### Running the Application

You'll need to run two processes concurrently: the Next.js frontend and the Genkit development server for AI functionalities.

1.  **Start the Genkit development server:**
    Open a terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit AI flows. Keep this terminal running.

2.  **Start the Next.js development server:**
    Open another terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Next.js application, typically on `http://localhost:9002` (or another port if 9002 is busy).

3.  **Open the app:**
    Open your web browser and navigate to the address shown by the `npm run dev` command (e.g., `http://localhost:9002`).

## Features

*   **Dynamic Daily Input:** Tell the app about your current energy, focus, academic load, and more.
*   **AI-Powered Schedule Generation:** Get a personalized daily schedule broken into manageable tasks.
*   **Personalized Tips:** Receive actionable tips based on your current situation and ADHD management principles.
*   **Progress Tracking:** Log your completed tasks and rate your day to visualize your progress over time.
*   **Achievements:** Unlock achievements for consistency and milestones.
*   **Light/Dark Mode:** Choose your preferred theme.
*   **Local Persistence:** Your daily logs, inputs, and achievements are saved in your browser's local storage.
*   **Adaptive Learning (Conceptual):** The AI is prompted to consider past patterns (though deep historical analysis is a future enhancement). The more you use the app and log your metrics, the more tailored its advice aims to become.

## Project Structure

*   `src/app/`: Next.js App Router pages and layouts.
*   `src/components/`: React components, including UI elements from ShadCN.
*   `src/ai/`: Genkit related files.
    *   `src/ai/flows/`: Genkit flow definitions (e.g., `daily-schedule-generator.ts`).
    *   `src/ai/genkit.ts`: Genkit initialization.
*   `src/lib/`: Utility functions and type definitions.
*   `src/hooks/`: Custom React hooks (e.g., `useTheme`, `useToast`).
*   `src/config/`: Application configurations (e.g., `achievements.ts`).
*   `public/`: Static assets.

## Tech Stack

*   Next.js (React framework)
*   TypeScript
*   Tailwind CSS
*   ShadCN UI (for UI components)
*   Genkit (for AI functionalities with Google AI)
*   Zod (for schema validation)
*   React Hook Form (for form handling)
*   Recharts (for charts)

## Contributing

This project is currently set up for individual use. If you plan to collaborate, ensure your Git and GitHub setup allows for shared repository access.
