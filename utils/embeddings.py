import pandas as pd
import torch
import requests
import chardet
from PIL import Image
from io import BytesIO
from configs.paths import CATALOG_PATH, EMBEDDINGS_DIR, IMAGES_PATH
from configs.constants import CLIP_VERSION
import os
from transformers import CLIPProcessor, CLIPModel
from tqdm import tqdm

# Utility to download an image from a URL, returns a PIL Image
# Returns a blank image if download fails
def download_image(url: str) -> Image.Image:
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    except Exception as e:
        print(f"Error downloading image: {str(e)}")
        return Image.new('RGB', (224, 224), color='black')

# Loads the product catalog and precomputed embeddings (or generates them if missing)
def load_catalog_embeddings():
    # Load and merge catalog and image data
    catalog = pd.read_csv(CATALOG_PATH)
    images_df = pd.read_csv(IMAGES_PATH)
    catalog = catalog.merge(images_df, on='id', how='left')
    
    # Ensure required columns are present (rename if needed)
    required_columns = ['product_id', 'shopify_cdn_url', 'category', 'color']
    if not all(col in catalog.columns for col in required_columns):
        catalog = catalog.rename(columns={
            'id': 'product_id',
            'product_type': 'category',
            'product_collections': 'color',
            'image_url': 'shopify_cdn_url'
        })
    
    # Warn if any products are missing image URLs
    missing_images = catalog[catalog['shopify_cdn_url'].isna()]
    if not missing_images.empty:
        print(f"Warning: {len(missing_images)} products missing image URLs")

    # Path to save/load catalog embeddings
    embeddings_path = EMBEDDINGS_DIR / "catalog_embeddings.pt"
    os.makedirs(EMBEDDINGS_DIR, exist_ok=True)
    
    # Load precomputed embeddings if available
    if embeddings_path.exists():
        print("Loading precomputed embeddings...")
        return catalog, torch.load(embeddings_path)

    # Initialize CLIP model for embedding generation
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = CLIPModel.from_pretrained(CLIP_VERSION).to(device)
    processor = CLIPProcessor.from_pretrained(CLIP_VERSION)
    
    # Generate embeddings for each product image
    embeddings = []
    for idx, row in tqdm(catalog.iterrows(), total=len(catalog), desc="Generating embeddings"):
        try:
            img = download_image(row['shopify_cdn_url'])
            inputs = processor(images=img, return_tensors="pt").to(device)
            with torch.no_grad():
                emb = model.get_image_features(**inputs)
            embeddings.append(emb.cpu())
        except Exception as e:
            print(f"Error processing {row.get('product_id', idx)}: {str(e)}")
            embeddings.append(torch.zeros(1, 512))
    
    # Concatenate and save embeddings
    embeddings = torch.cat(embeddings)
    torch.save(embeddings, embeddings_path)
    return catalog, embeddings