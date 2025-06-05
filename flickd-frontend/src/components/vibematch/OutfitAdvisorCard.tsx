"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface OutfitAdvisorCardProps {
  advice: string;
}

export function OutfitAdvisorCard({ advice }: OutfitAdvisorCardProps) {
  if (!advice) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <div>
            <CardTitle className="text-xl font-headline">Outfit Advisor</CardTitle>
            <CardDescription>Styling tips based on your video's vibe.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
          {advice}
        </p>
      </CardContent>
    </Card>
  );
}
