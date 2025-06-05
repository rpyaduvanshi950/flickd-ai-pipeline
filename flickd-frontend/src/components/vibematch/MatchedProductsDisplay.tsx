"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types/vibematch";
import { ProductCard } from "./ProductCard";

interface MatchedProductsDisplayProps {
  products: Product[];
}

export function MatchedProductsDisplay({ products }: MatchedProductsDisplayProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-headline">Matched Products</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
