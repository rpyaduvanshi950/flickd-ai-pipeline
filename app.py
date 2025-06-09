from flask import Flask, request, jsonify
import os
import uuid
import cv2
import numpy as np
from werkzeug.utils import secure_filename
from components.vibe_tagger import VibeTagger
from components.product_matcher import ProductMatcher
from components.frame_extractor import extract_frames
import json

from flask_cors import CORS

# Initialize Flask app and enable CORS for cross-origin requests
app = Flask(__name__)
CORS(app) 

# Configuration for upload folder and allowed video extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load vibes list and initialize model components once at startup
with open("vibes_list.json") as f:
    vibes_list = json.load(f)
    
vibe_tagger = VibeTagger(vibes_list)
product_matcher = ProductMatcher()

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Main API endpoint for video analysis
@app.route('/analyze', methods=['POST'])
def analyze_video():
    # Check if video file is present in the request
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
        
    file = request.files['video']
    
    # Check for empty filename
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    # Check for valid file type
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    try:
        # Ensure uploads directory exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Generate a unique filename for the uploaded video
        video_id = str(uuid.uuid4())
        filename = secure_filename(f"{video_id}.mp4")
        video_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save the uploaded video file
        file.save(video_path)
        
        # Verify the file was saved successfully
        if not os.path.exists(video_path):
            return jsonify({"error": "Failed to save video"}), 500
            
        # Verify the video file can be opened by OpenCV
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError("Could not open video file")
            cap.release()
        except Exception as e:
            os.remove(video_path)
            return jsonify({"error": f"Invalid video file: {str(e)}"}), 400
        
        # Process the video through the pipeline
        try:
            # Extract frames, predict vibes, detect and match products
            frames = extract_frames(video_path)
            vibes = vibe_tagger.predict(frames)
            detections = product_matcher.detect_objects(frames)
            products = product_matcher.match_products(detections)
            
            # Prepare products for JSON serialization
            serializable_products = []
            for product in products:
                serializable_products.append({
                    "type": str(product['type']),
                    "color": str(product['color']),
                    "match_type": str(product['match_type']),
                    "matched_product_id": str(product['matched_product_id']),
                    "confidence": float(product['confidence'])
                })
            
            # Build response
            response = {
                "video_id": video_id,
                "vibes": vibes,
                "products": serializable_products
            }
            
            # Clean up uploaded video file
            os.remove(video_path)
            return jsonify(response), 200
            
        except Exception as e:
            os.remove(video_path)
            return jsonify({"error": f"Processing error: {str(e)}"}), 500
            
    except Exception as e:
        # Clean up in case of any server error
        if 'video_path' in locals() and os.path.exists(video_path):
            os.remove(video_path)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)