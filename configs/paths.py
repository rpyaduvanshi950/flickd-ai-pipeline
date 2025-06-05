from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
VIDEO_DIR = BASE_DIR / "videos"
CATALOG_PATH = BASE_DIR / "catalog.csv"
VIBES_PATH = BASE_DIR / "vibes_list.json"
OUTPUT_DIR = BASE_DIR / "outputs"
EMBEDDINGS_DIR = BASE_DIR / "embeddings"
IMAGES_PATH = BASE_DIR / "images.csv"  