
"use client";

import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"; // Removed CardHeader
import type { Product } from "@/types/vibematch";
import { Shirt, Palette, Zap, Percent, ShoppingCart, Tag } from "lucide-react"; // Added Tag for matchType
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <CardContent className="p-4 space-y-4">
        <div>
          <CardTitle className="text-lg font-semibold font-headline leading-tight">{product.name}</CardTitle>
          {/* Removed Badge for matchType here, will integrate below */}
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Shirt className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
            <span>Type: {product.type}</span>
          </div>
          <div className="flex items-center">
            <Palette className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
            <span>Color: {product.color}</span>
          </div>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
            <span>Match: <Badge variant="outline" className="ml-1 text-xs">{product.matchType}</Badge></span>
          </div>
          <div className="flex items-center">
            <Percent className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
            <span>Confidence: {product.confidence}%</span>
          </div>
        </div>
        <button className="w-full mt-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Product
        </button>
      </CardContent>
    </Card>
  );
}
