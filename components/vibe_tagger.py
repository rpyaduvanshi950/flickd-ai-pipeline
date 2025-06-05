from transformers import CLIPProcessor, CLIPModel
import torch
from PIL import Image
from tqdm import tqdm
from configs.constants import MAX_VIBES, CLIP_VERSION

class VibeTagger:
    def __init__(self, vibes_list: list):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading CLIP model: {CLIP_VERSION}")
        self.model = CLIPModel.from_pretrained(CLIP_VERSION).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(CLIP_VERSION)
        self.vibes = vibes_list
        self.text_embeddings = self._precompute_text_embeddings()
        print("Vibe tagger initialized successfully")

    def _precompute_text_embeddings(self):
        print("Precomputing text embeddings...")
        inputs = self.processor(
            text=[f"a {vibe} fashion style" for vibe in self.vibes], 
            return_tensors="pt", 
            padding=True,
            truncation=True
        ).to(self.device)
        with torch.no_grad():
            return self.model.get_text_features(**inputs)

    def predict(self, frames: list) -> list:
        if not frames:
            return []
        
        try:
            print(f"Processing {len(frames)} frames for vibes...")
            pil_images = [Image.fromarray(frame) for frame in frames]
            
            # Process in batches
            batch_size = 4
            image_features = []
            
            for i in tqdm(range(0, len(pil_images), batch_size),
                         desc="Processing frames"):
                batch = pil_images[i:i+batch_size]
                inputs = self.processor(
                    images=batch,
                    return_tensors="pt",
                    padding=True
                ).to(self.device)
                
                with torch.no_grad():
                    features = self.model.get_image_features(**inputs)
                    image_features.append(features.cpu())
            
            image_features = torch.cat(image_features)
            video_embedding = torch.mean(image_features, dim=0, keepdim=True)
            
            similarities = torch.matmul(
                self.text_embeddings, 
                video_embedding.to(self.device).T
            ).squeeze()
            
            top_indices = torch.topk(
                similarities, 
                min(MAX_VIBES, len(self.vibes))
            ).indices
            
            result = [self.vibes[i] for i in top_indices.cpu().numpy()]
            print(f"Detected vibes: {result}")
            return result
            
        except Exception as e:
            print(f"Error in vibe prediction: {str(e)}")
            return []