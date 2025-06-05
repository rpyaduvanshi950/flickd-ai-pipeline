import cv2
import numpy as np
from configs.paths import VIDEO_DIR
from configs.constants import MAX_FRAMES

def extract_frames(video_path, target_fps=1):
    frames = []
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Could not open video: {video_path}")
            
        original_fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = int(round(original_fps / target_fps))
        frame_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            if frame_count % frame_interval == 0:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(frame_rgb)
                
                if len(frames) >= MAX_FRAMES:
                    break
                    
            frame_count += 1
            
        cap.release()
        return frames
        
    except Exception as e:
        if 'cap' in locals():
            cap.release()
        raise e