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

app = Flask(__name__)
CORS(app) 

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize components once (when the app starts)
with open("vibes_list.json") as f:
    vibes_list = json.load(f)
    
vibe_tagger = VibeTagger(vibes_list)
product_matcher = ProductMatcher()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/analyze', methods=['POST'])
def analyze_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
        
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    try:
        # Create uploads directory if not exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Generate unique filename
        video_id = str(uuid.uuid4())
        filename = secure_filename(f"{video_id}.mp4")
        video_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save file
        file.save(video_path)
        
        # Verify file was saved
        if not os.path.exists(video_path):
            return jsonify({"error": "Failed to save video"}), 500
            
        # Verify video can be opened
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError("Could not open video file")
            cap.release()
        except Exception as e:
            os.remove(video_path)
            return jsonify({"error": f"Invalid video file: {str(e)}"}), 400
        
        # Process the video
        try:
            frames = extract_frames(video_path)
            vibes = vibe_tagger.predict(frames)
            detections = product_matcher.detect_objects(frames)
            products = product_matcher.match_products(detections)
            
            serializable_products = []
            for product in products:
                serializable_products.append({
                    "type": str(product['type']),
                    "color": str(product['color']),
                    "match_type": str(product['match_type']),
                    "matched_product_id": str(product['matched_product_id']),
                    "confidence": float(product['confidence'])
                })
            
            response = {
                "video_id": video_id,
                "vibes": vibes,
                "products": serializable_products
            }
            
            os.remove(video_path)
            return jsonify(response), 200
            
        except Exception as e:
            os.remove(video_path)
            return jsonify({"error": f"Processing error: {str(e)}"}), 500
            
    except Exception as e:
        if 'video_path' in locals() and os.path.exists(video_path):
            os.remove(video_path)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)