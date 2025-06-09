# Detection thresholds and pipeline configuration
MAX_FRAMES = 15  # Maximum frames to process per video
DETECTION_CONFIDENCE = 0.2  # Minimum confidence for object detection
MATCH_THRESHOLD = 0.75  # Minimum similarity for product matching
EXACT_MATCH_THRESHOLD = 0.9  # Threshold for "exact" match classification
MAX_PRODUCTS = 4  # Maximum products to return per video
MAX_VIBES = 3  # Maximum vibes to return per video

# Model versions for OWL-ViT and CLIP
OWL_VIT_VERSION = "google/owlvit-base-patch32"
CLIP_VERSION = "openai/clip-vit-base-patch32"  
