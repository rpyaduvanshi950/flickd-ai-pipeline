
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { VideoUploadCard } from "@/components/vibematch/VideoUploadCard";
import { VibeChipsDisplay } from "@/components/vibematch/VibeChipsDisplay";
import { MatchedProductsDisplay } from "@/components/vibematch/MatchedProductsDisplay";
import { OutfitAdvisorCard } from "@/components/vibematch/OutfitAdvisorCard";
import { LoadingState } from "@/components/vibematch/LoadingState";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@/types/vibematch";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (videoFile) {
      const objectUrl = URL.createObjectURL(videoFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [videoFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnalysisResult(null); // Clear previous results when a new file is selected
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      } else {
        setVideoFile(file); // Allow setting it to show error in VideoUploadCard
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select a valid video file (mp4, mov, avi).",
        });
      }
    } else {
      setVideoFile(null);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !videoFile.type.startsWith("video/")) {
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: "Please select a valid video file before analyzing.",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('video', videoFile, videoFile.name);

      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Server responded with ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          // Failed to parse JSON, use status text or default
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result: AnalysisResult = await response.json();
      
      setAnalysisResult(result);
      setIsLoading(false);
      toast({
        title: "Analysis Complete!",
        description: "Your video's vibe and matched products are ready.",
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze the video. Please try again.",
      });
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setIsLoading(false);
    // Also reset the file input visually
    const fileInput = document.getElementById('video-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4 pt-10 sm:p-8 bg-background font-body">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-bold font-headline text-primary">Flickd AI Pipeline</h1>
          <p className="mt-2 text-lg text-foreground/80">
            Discover the vibe and products in your fashion videos!
          </p>
        </header>

        <section className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold font-headline text-foreground mb-3">How It Works</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/90">
            <li>Upload a short fashion video (mp4, mov, avi).</li>
            <li>Instantly preview your video before submitting.</li>
            <li>Our AI analyzes the video to detect the top fashion "vibes" (styles) and matches visible products to a curated catalog.</li>
            <li>Get results in seconds: see detected vibes as tags and matched products with details.</li>
            <li>Powered by advanced vision-language models (CLIP, OWL-ViT).</li>
          </ul>
        </section>

        {!analysisResult && !isLoading && (
          <VideoUploadCard
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            videoFile={videoFile}
            isLoading={isLoading}
            previewUrl={previewUrl}
          />
        )}

        {isLoading && <LoadingState />}

        {!isLoading && analysisResult && (
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            <VibeChipsDisplay vibes={analysisResult.vibes} />
            <MatchedProductsDisplay products={analysisResult.products} />
            <OutfitAdvisorCard advice={analysisResult.advice} />
            <div className="flex justify-center">
              <Button onClick={handleReset} variant="outline" size="lg">
                <RefreshCw className="mr-2 h-5 w-5" />
                Analyze Another Video
              </Button>
            </div>
          </div>
        )}
      </div>
      <footer className="py-8 mt-16 text-center text-muted-foreground text-sm">
        <p>Designed and developed by Pushpender.</p>
        <p>&copy; {new Date().getFullYear()} Flickd AI Pipeline. All rights reserved.</p>
      </footer>
    </main>
  );
}
