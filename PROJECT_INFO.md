# Silly School - Project Documentation

Silly School is a vibrant, interactive web application designed to help kids learn alphabets, math, and enjoy nursery rhymes in a fun and engaging way.

## 🚀 Tech Stack

- **Frontend Framework**: [Vite](https://vitejs.dev/) (Fast development server and bundler)
- **Language**: Vanilla JavaScript (ES Modules)
- **Styling**: Vanilla CSS (Custom properties, animations, responsive design)
- **Backend / Database**: [Supabase](https://supabase.com/) (Used for progress tracking/stars)
- **Speech Synthesis**: Browser's Native SpeechSynthesis API (for TTS support)

## ✨ Core Features

### 1. Alphabet Zoo
- **Interactive Grid**: Kids can explore the alphabet through a colorful grid of letters.
- **Visual Learning**: Each letter shows a corresponding word and emoji (e.g., A for Apple 🍎).
- **Audio Support**: Plays MP3 sounds for each letter with a Text-to-Speech (TTS) fallback.
- **Kid-Friendly UI**: High-contrast letters and smooth overlays.

### 2. Math Magic
- **Number Learning**: A grid of numbers from 1 to 20 with interactive audio feedback.
- **Dynamic Math Quiz**: Generates random problems for Addition, Subtraction, Multiplication, and Division.
- **Difficulty Scaling**: Numbers are kept small for kids, and subtraction ensures positive results.
- **Instant Feedback**: Fun success messages and star tracking for correct answers.

### 3. Rhymes Section
- **Video Library**: Curated list of popular nursery rhymes (Twinkle Twinkle, Baby Shark, etc.).
- **Safe Embedding**: Uses YouTube Iframe API for safe and controlled viewing.
- **Easy Navigation**: Simple grid layout for selecting favorite rhymes.

## 📁 Project Structure

```text
.
├── frontend/            # Web Application (Vite/Vanilla JS)
│   ├── Dockerfile
│   ├── docker/          # Nginx config
│   ├── index.html
│   ├── package.json
│   ├── public/
│   ├── scripts/         # Asset download script
│   └── src/             # Features, Services, Utils, Styles
├── backend/             # Future API / Server Logic
│   ├── package.json
│   └── src/
│       └── index.js
├── docker-compose.yml   # Web service orchestration
├── PROJECT_INFO.md
├── ACTION_PLAN.md
└── DEPLOYMENT.md
```

## 🛠️ Setup and Installation

### Local Development
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd ag-kidsapp-1
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Download assets**:
   ```bash
   node download-assets.js
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Deployment
Refer to [DEPLOYMENT.md](file:///home/siya/projects/ag-kidsapp-1/DEPLOYMENT.md) for detailed AWS CodeBuild and Elastic Beanstalk instructions, or use the [Dockerfile](file:///home/siya/projects/ag-kidsapp-1/Dockerfile) for containerized hosting.

## 🎨 Design Philosophy
- **Rich Aesthetics**: Vibrant HSL-based colors, rounded corners, and "pop-in" animations.
- **Accessibility**: Large fonts, intuitive icons, and speech synthesis.
- **Safety**: Prevents text selection and uses safe video embeds to ensure a kid-friendly environment.
