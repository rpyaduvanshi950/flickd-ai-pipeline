
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface VibeChipsDisplayProps {
  vibes: string[];
}

export function VibeChipsDisplay({ vibes }: VibeChipsDisplayProps) {
  if (!vibes || vibes.length === 0) {
    return null; 
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 text-accent" />
          <CardTitle className="text-xl font-headline">Detected Vibes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {vibes.map((vibe, index) => (
            <Badge key={index} variant="secondary" className="text-sm px-3 py-1 bg-accent/10 text-black border-accent/30">
              {vibe}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
