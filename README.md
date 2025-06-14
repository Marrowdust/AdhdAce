# 🧠 ADHD Ace
### Your Personal AI Productivity Assistant

> **Designed specifically for students with ADHD** — harness the power of AI to transform your daily productivity and focus management.

ADHD Ace is a cutting-edge Next.js and Genkit-powered productivity companion that understands your unique mental flow patterns. By leveraging advanced AI technology, it creates personalized schedules and actionable insights tailored to your ADHD brain.

---

## 🚀 Quick Start Installation
### One-Command Setup (Linux Recommended)

Perfect for **Arch Linux** users — get up and running instantly:

```bash
bash <(curl -s https://raw.githubusercontent.com/Marrowdust/AdhdAce/main/install-adhdace.sh)
```

**What this magical script does:**
- 📦 Clones the repository automatically
- 🔑 Prompts for your Gemini API Key (from Google AI Studio)
- ⚙️ Installs all dependencies seamlessly  
- 📝 Sets up your `.env` configuration
- 🎯 Creates a beautiful launcher with app menu integration

> **Note:** Optimized and tested for Arch Linux. Other distributions may work but aren't officially supported yet.

---

## 🛠️ Manual Setup
### For Non-Arch Systems or Custom Control

### Prerequisites
- **Node.js** (v18 or later) 
- **npm** (bundled with Node.js)
- **Google AI API Key** (from Google AI Studio)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Marrowdust/AdhdAce.git
   cd AdhdAce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY_HERE"
   ```
   
   Replace `YOUR_GOOGLE_AI_API_KEY_HERE` with your actual Gemini API key.

---

## 🚀 Running ADHD Ace

You'll need **two terminal windows** for the full experience:

### Terminal 1: AI Engine
```bash
npm run genkit:dev
```

### Terminal 2: Frontend Interface  
```bash
npm run dev
```

🌐 **Access your app:** Open your browser to the displayed address (typically `http://localhost:9002`)

---

## ✨ Powerful Features

### 🎯 **Dynamic Daily Input**
Log your current focus levels, energy states, and workload in real-time

### 🤖 **AI-Powered Scheduling**
Receive intelligent, personalized daily plans that adapt to your mental state

### 💡 **Science-Backed Tips**
Get evidence-based advice rooted in ADHD research and cognitive science

### 📊 **Progress Tracking**
Beautiful visual logs showcasing your completed days and accomplished tasks

### 🏆 **Achievement System**
Earn motivational badges that celebrate consistency and progress

### 🌓 **Adaptive Themes**
Switch between light and dark modes to match your preferences

### 🔒 **Local Data Storage**
Your personal information stays secure in your browser—no cloud dependency

### 🧠 **Adaptive Learning**
The app evolves with you, becoming more personalized over time

---

## 🗂️ Project Architecture

```
src/
├── app/           # Next.js pages and layouts
├── components/    # Reusable UI components (ShadCN)
├── ai/           # Genkit AI integration
│   ├── flows/    # AI routine definitions
│   └── genkit.ts # AI engine configuration
├── lib/          # Utility functions and TypeScript types
├── hooks/        # Custom React hooks
└── config/       # Static configurations (achievements, etc.)

public/           # Static assets (images, icons, manifests)
```

---

## 🧰 Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js (React) | Modern web application foundation |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | ShadCN UI | Beautiful, accessible components |
| **AI Engine** | Genkit (Google AI) | Intelligent task management |
| **Validation** | Zod | Schema validation |
| **Forms** | React Hook Form | Efficient form handling |
| **Charts** | Recharts | Data visualization |

---

## 🤝 Contributing

ADHD Ace is currently optimized for individual use. If you're interested in contributing or forking for team collaboration, please ensure your Git/GitHub setup supports:

- Shared branch workflows
- Pull request processes  
- Collaborative development practices

---

## 🔒 Privacy & Security

**Your data, your control:**
- 🔑 API keys stored exclusively in your local `.env` file
- 🚫 No data sharing or uploading to external servers
- 🔗 Direct, secure communication with Google's Gemini API only
- 💾 All personal data remains in your browser's local storage

---

## 📞 Support & Resources

- **Repository:** [GitHub - ADHD Ace](https://github.com/Marrowdust/AdhdAce)
- **API Setup:** [Google AI Studio](https://aistudio.google.com)

---

*Built with ❤️ for the ADHD community*
