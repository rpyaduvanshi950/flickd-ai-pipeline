
"use client";

import type React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileVideo, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadCardProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  videoFile: File | null;
  isLoading: boolean;
  previewUrl?: string | null;
}

export function VideoUploadCard({ onFileChange, onUpload, videoFile, isLoading, previewUrl }: VideoUploadCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Film className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-headline">Upload Your Video</CardTitle>
            <CardDescription>Select a video file (mp4, mov, avi) to begin.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {previewUrl && videoFile?.type.startsWith('video/') && (
          <div className="rounded-md overflow-hidden border border-muted aspect-video bg-muted/50 flex items-center justify-center">
            <video src={previewUrl} controls className="w-full h-full object-cover" />
          </div>
        )}
        {videoFile && !videoFile.type.startsWith('video/') && (
           <p className="text-sm text-destructive">Please select a valid video file (mp4, mov, avi).</p>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="video-upload" className="text-sm font-medium">Choose a video file</Label>
          <div className="flex space-x-3">
            <Input
              id="video-upload"
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/avi" // More specific accept types
              className="hidden"
              onChange={onFileChange}
              disabled={isLoading}
            />
            <Label
              htmlFor="video-upload"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "cursor-pointer flex-grow justify-start",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <FileVideo className="mr-2 h-5 w-5" />
              {videoFile ? videoFile.name : "Select Video (mp4, mov, avi)"}
            </Label>
          </div>
        </div>

      </CardContent>
      <CardFooter>
        <Button 
          onClick={onUpload} 
          disabled={!videoFile || isLoading || (videoFile && !videoFile.type.startsWith('video/'))} 
          className="w-full"
          size="lg"
        >
          <UploadCloud className="mr-2 h-5 w-5" />
          {isLoading ? "Analyzing..." : "Analyze Vibe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
