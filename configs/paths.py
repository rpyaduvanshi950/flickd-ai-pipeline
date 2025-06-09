from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent
# Directory for storing videos
VIDEO_DIR = BASE_DIR / "videos"
# Path to the product catalog CSV
CATALOG_PATH = BASE_DIR / "catalog.csv"
# Path to the vibes/styles list JSON
VIBES_PATH = BASE_DIR / "vibes_list.json"
# Directory for output files
OUTPUT_DIR = BASE_DIR / "outputs"
# Directory for precomputed catalog embeddings
EMBEDDINGS_DIR = BASE_DIR / "embeddings"
# Path to product images CSV
IMAGES_PATH = BASE_DIR / "images.csv"  