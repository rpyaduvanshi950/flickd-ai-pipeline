# Flickd AI Pipeline

## Overview
Flickd AI Pipeline is an end-to-end system for analyzing fashion videos. It detects the overall "vibe" (style) of a video and matches visible products to a catalog using state-of-the-art vision-language models. The pipeline is designed for fashion discovery, trend analysis, and product recommendation from user-uploaded videos.

## Features
- **Video Upload & Analysis**: Upload a video and receive detected vibes and matched products.
- **Vibe Detection**: Uses CLIP to predict the top fashion styles ("vibes") present in the video.
- **Product Detection & Matching**: Detects fashion items in video frames and matches them to a product catalog using OWL-ViT and CLIP.
- **REST API**: Simple Flask API for integration.

## Project Structure
```
├── pipeline.py              # Main Flask API and pipeline logic
├── requirements.txt         # Python dependencies
├── components/              # Core pipeline modules
│   ├── vibe_tagger.py       # Vibe detection using CLIP
│   ├── product_matcher.py   # Product detection and matching
│   └── frame_extractor.py   # Video frame extraction
├── configs/                 # Configuration and constants
│   ├── constants.py         # Thresholds, model versions, etc.
│   └── paths.py             # File and directory paths
├── utils/                   # Utility functions
│   └── embeddings.py        # Catalog embedding loader
├── uploads/                 # Temporary video uploads
├── outputs/                 # Output files (if any)
├── embeddings/              # Precomputed catalog embeddings
├── catalog.csv              # Product catalog
├── images.csv               # Product image URLs
├── vibes_list.json          # List of supported vibes/styles
```

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd flickd-ai-pipeline
   ```
2. **Create a virtual environment (optional but recommended)**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Prepare Data**
   - Ensure `catalog.csv`, `images.csv`, and `vibes_list.json` are present in the root directory.
   - The first run will generate catalog embeddings in the `embeddings/` directory (may take several minutes).

5. **Run the API server**
   ```bash
   python pipeline.py
   ```
   The server will start at `http://0.0.0.0:5000`.

## Pipeline Explanation
### 1. Frame Extraction
- Extracts up to 15 frames per video (1 frame per second by default).
- Uses OpenCV for efficient frame sampling.

### 2. Vibe Detection
- Each frame is processed by a CLIP model.
- Computes similarity between frame embeddings and a list of vibe/style prompts.
- Returns the top 3 detected vibes for the video.

### 3. Product Detection & Matching
- Uses OWL-ViT to detect objects (fashion categories) in each frame.
- Crops detected objects and computes their CLIP embeddings.
- Matches each detected item to the closest product in the catalog using cosine similarity.
- Returns up to 4 matched products per video, with type, color, match type, and confidence score.

## API Usage
### Endpoint: `/analyze` (POST)
- **Request**: Multipart form with a `video` file (mp4, mov, avi)
- **Response**: JSON with detected vibes and matched products

#### Example Request (using `curl`):
```bash
curl -X POST http://localhost:5000/analyze \
  -F "video=@/path/to/your/video.mp4"
```

#### Example Response
```json
{
  "video_id": "...",
  "vibes": ["streetwear", "minimal", "retro"],
  "products": [
    {
      "type": "jacket",
      "color": "black",
      "match_type": "exact",
      "matched_product_id": "12345",
      "confidence": 0.92
    },
    ...
  ]
}
```

## Notes & Troubleshooting
- Requires a CUDA-capable GPU for best performance (CPU fallback is supported but slow).
- Ensure all data files (`catalog.csv`, `images.csv`, `vibes_list.json`) are present and correctly formatted.
- The first run may be slow as it downloads models and computes catalog embeddings.
- For production, set `debug=False` in `pipeline.py`.

## Frontend Web Application
A modern React + MUI frontend is available in the `frontend-flickd` directory.

### How to Run the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend-flickd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or as shown in your terminal).

### How it Connects
- The frontend communicates with the backend Flask API at `http://localhost:5000/analyze`.
- Make sure the backend is running before using the frontend.

For more details, see `frontend-flickd/README.md`.

---

*For questions or contributions, please open an issue or pull request.* 