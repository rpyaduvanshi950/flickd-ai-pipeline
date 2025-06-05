export interface Product {
  id: string;
  name: string;
  type: string;
  color: string;
  matchType: string;
  confidence: number;
  imageUrl: string;
  imageHint?: string;
}

export interface AnalysisResult {
  vibes: string[];
  products: Product[];
  advice: string;
}
