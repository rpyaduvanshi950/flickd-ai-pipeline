# Flickd AI Pipeline Frontend

## Overview
This is the modern, responsive web interface for the Flickd AI Pipeline. It allows users to upload a fashion-related video, preview it, submit it for AI analysis, and view detected vibes and matched products—all in a seamless, visually appealing experience.

## Features
- **Video Upload & Preview**: Drag-and-drop or click to upload. Preview your video before submitting.
- **Real-Time Status**: Loading indicators and progress bars during analysis.
- **AI-Powered Results**: See detected fashion "vibes" as tags and matched products as cards.
- **Responsive Design**: Works beautifully on desktop and mobile.
- **Modern UI**: Built with React and Material-UI (MUI) for a professional look and feel.

## Setup Instructions
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or as shown in your terminal).

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
- **React** (Vite)
- **Material-UI (MUI)** for components and theming
- **Fetch API** for backend communication
- **Responsive CSS** (MUI Grid/Flexbox)

## Example Screenshots
> _Add screenshots here_
- ![Upload & Preview](./screenshots/upload-preview.png)
- ![Analysis Results](./screenshots/analysis-results.png)

## Project Structure
```
frontend-flickd/
├── src/
│   ├── App.jsx         # Main UI logic
│   ├── index.css       # Global styles
│   └── ...
├── public/
├── package.json
└── README.md
```

## Contributing
Pull requests and suggestions are welcome! For major changes, please open an issue first.

## License
MIT

---

_This frontend is part of the Flickd AI Pipeline project. For backend/API details, see the main project README._ 