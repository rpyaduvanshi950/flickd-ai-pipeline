import json
import numpy as np
from pathlib import Path
from configs.paths import OUTPUT_DIR

# Convert numpy types and arrays to native Python types for JSON serialization
def convert_to_serializable(obj):
    """Convert numpy types to native Python types for JSON serialization"""
    if isinstance(obj, (np.int32, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    return obj

# Save the pipeline output (video_id, vibes, products) to a JSON file
def save_output(video_id: str, vibes: list, products: list):
    """Save pipeline output to JSON file"""
    output_path = Path(OUTPUT_DIR) / f"{video_id}.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    output = {
        "video_id": video_id,
        "vibes": vibes,
        "products": convert_to_serializable(products)
    }
    
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"Saved output to {output_path}")