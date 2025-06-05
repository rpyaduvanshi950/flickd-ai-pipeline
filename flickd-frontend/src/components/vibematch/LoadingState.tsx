"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Analyzing your vibe..." }: LoadingStateProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground font-medium">{message}</p>
      </CardContent>
    </Card>
  );
}
