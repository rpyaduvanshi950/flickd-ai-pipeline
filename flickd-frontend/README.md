# Flickd AI Pipeline Frontend

## Overview
This is the modern, responsive web interface for the Flickd AI Pipeline, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Radix UI**. Users can upload a fashion-related video, preview it, submit it for AI analysis, and view detected vibes and matched products—all in a seamless, visually appealing experience.

## Features
- **Video Upload & Preview**: Drag-and-drop or click to upload. Preview your video before submitting.
- **Real-Time Status**: Loading indicators and progress bars during analysis.
- **AI-Powered Results**: See detected fashion "vibes" as tags and matched products as cards.
- **Responsive Design**: Works beautifully on desktop and mobile.
- **Modern UI**: Built with Next.js, Tailwind CSS, and Radix UI for accessibility and a professional look.
- **Modular Components**: Reusable, well-typed components for upload, display, and feedback.

## Setup Instructions
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:9002` (or as shown in your terminal).

3. **Backend Requirement**
   - The backend Flask API must be running and accessible at `http://localhost:5000`.
   - See the main project README for backend setup.

## Usage Guide
1. Upload a `.mp4`, `.mov`, or `.avi` fashion video.
2. Preview your video in the browser.
3. Click "Analyze Video" to send it to the backend.
4. Wait for the analysis (progress/loading shown).
5. View detected vibes (tags) and matched products (cards with details and links).

## Tech Stack
- **Next.js 15+ (App Router, TypeScript)**
- **Tailwind CSS** for utility-first styling and custom theme
- **Radix UI** for accessible, composable UI primitives
- **Lucide React** for icons
- **Custom modular components** (see `src/components/`)
- **Fetch API** for backend communication

## Project Structure
```
flickd-frontend/
├── src/
│   ├── app/                  # Next.js App Router entry (layout, page, etc.)
│   ├── components/
│   │   ├── vibematch/        # Video upload, result, and display components
│   │   └── ui/               # Radix UI-based primitives (Button, Card, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── types/                # TypeScript types
│   └── ...
├── public/
├── tailwind.config.ts        # Tailwind theme and config
├── next.config.ts            # Next.js config
├── package.json
└── README.md
```

## Extensibility & Customization
- **Easy to extend**: Add new UI components, pages, or API integrations using the modular structure.
- **Custom theming**: Tailwind config and CSS variables allow for quick theme changes (light/dark, brand colors).
- **Accessible by default**: Radix UI ensures keyboard and screen reader support.

## Example Screenshots
> _Add screenshots here_
- ![Upload & Preview](./screenshots/upload-preview.png)
- ![Analysis Results](./screenshots/analysis-results.png)

## Contributing
Pull requests and suggestions are welcome! For major changes, please open an issue first.

## License
MIT

---

_This frontend is part of the Flickd AI Pipeline project. For backend/API details, see the main project README._ 