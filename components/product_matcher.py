
from transformers import OwlViTProcessor, OwlViTForObjectDetection
from transformers import CLIPProcessor, CLIPModel
import torch
from torchvision.ops import box_convert
from PIL import Image
from configs.constants import *
from utils.embeddings import load_catalog_embeddings
from tqdm import tqdm

class ProductMatcher:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print("Initializing product matcher...")
        
        # Initialize OWL-ViT
        self.owl_processor = OwlViTProcessor.from_pretrained(OWL_VIT_VERSION)
        self.owl_model = OwlViTForObjectDetection.from_pretrained(OWL_VIT_VERSION).to(self.device)
        
        # Initialize CLIP
        self.clip_processor = CLIPProcessor.from_pretrained(CLIP_VERSION)
        self.clip_model = CLIPModel.from_pretrained(CLIP_VERSION).to(self.device)
        
        # Load catalog
        self.catalog, self.catalog_embeddings = load_catalog_embeddings()
        self.categories = list(set(self.catalog['category']))
        print(f"Loaded catalog with {len(self.catalog)} products")

    def detect_objects(self, frames: list) -> list:
        detections = []
        for frame in tqdm(frames, desc="Detecting objects"):
            pil_image = Image.fromarray(frame)
            inputs = self.owl_processor(
                text=self.categories,
                images=pil_image,
                return_tensors="pt"
            ).to(self.device)
            
            with torch.no_grad():
                outputs = self.owl_model(**inputs)
            
            target_sizes = torch.Tensor([pil_image.size[::-1]]).to(self.device)
            results = self.owl_processor.post_process_object_detection(
                outputs=outputs,
                target_sizes=target_sizes,
                threshold=DETECTION_CONFIDENCE
            )
            
            boxes = results[0]["boxes"]
            scores = results[0]["scores"]
            labels = results[0]["labels"]
            
            for box, score, label in zip(boxes, scores, labels):
                box = box_convert(box, in_fmt="cxcywh", out_fmt="xyxy").int().tolist()
                crop = pil_image.crop(box)
                
                detections.append({
                    "category": self.categories[label],
                    "box": box,
                    "score": score.item(),
                    "crop": crop
                })
        
        print(f"Detected {len(detections)} objects")
        return detections

    def match_products(self, detections: list) -> list:
        matched = []
        for detection in tqdm(detections, desc="Matching products"):
            try:
                inputs = self.clip_processor(
                    images=detection['crop'],
                    return_tensors="pt"
                ).to(self.device)
                
                with torch.no_grad():
                    crop_embedding = self.clip_model.get_image_features(**inputs)
                    crop_embedding /= crop_embedding.norm(dim=-1, keepdim=True)
                
                similarities = torch.matmul(
                    self.catalog_embeddings,
                    crop_embedding.T
                ).squeeze()
                
                max_idx = torch.argmax(similarities).item()
                max_sim = similarities[max_idx].item()
                
                if max_sim >= MATCH_THRESHOLD:
                    product = self.catalog.iloc[max_idx]
                    matched.append({
                        "type": product['category'],
                        "color": product['color'],
                        "matched_product_id": product['product_id'],
                        "match_type": "exact" if max_sim >= EXACT_MATCH_THRESHOLD else "similar",
                        "confidence": max_sim,
                        "detection_score": detection['score']
                    })
            except Exception as e:
                print(f"Error matching product: {str(e)}")
                continue
        
        return self._filter_products(matched)

    def _filter_products(self, products: list) -> list:
        if not products:
            return []
        
        # Deduplicate by product ID
        product_map = {}
        for product in products:
            pid = product['matched_product_id']
            if pid not in product_map or product_map[pid]['confidence'] < product['confidence']:
                product_map[pid] = product
        
        # Sort by confidence
        sorted_products = sorted(
            product_map.values(),
            key=lambda x: x['confidence'] * x['detection_score'],
            reverse=True
        )
        
        return sorted_products[:min(MAX_PRODUCTS, len(sorted_products))]