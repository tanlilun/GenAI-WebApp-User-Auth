import React, { useState, useEffect, useCallback } from "react";
import { AssetSet } from "../../store/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Copy, Check, Play, Video } from "lucide-react";
import banklogo from "../img/UnionBank-logo.png";
import visalogo from "../img/VISA-logo.png";

export default function VideoAdSection({ assetSet, onUpdateAssetSet }) {
  const videoAd = assetSet.video_ad || {};
  const [overlayText, setOverlayText] = useState(videoAd.overlay_text || "");
  const [copied, setCopied] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Copy overlay text
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle input change
  const handleOverlayChange = (value) => {
    setOverlayText(value);
    setIsDirty(true);
  };

  // Auto-save with debounce (2s after stop typing)
  const saveOverlay = useCallback(async () => {
    if (!isDirty) return;
    try {
      const updatedVideoAd = { ...videoAd, overlay_text: overlayText };
      const updatedAssetSet = { ...assetSet, video_ad: updatedVideoAd };

      await AssetSet.getState().update(assetSet._id, { video_ad: updatedVideoAd });
      onUpdateAssetSet(updatedAssetSet);

      setIsDirty(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [overlayText, isDirty, assetSet, onUpdateAssetSet, videoAd]);

  useEffect(() => {
    if (!isDirty) return;
    const timeout = setTimeout(() => saveOverlay(), 2000);
    return () => clearTimeout(timeout);
  }, [overlayText, isDirty, saveOverlay]);

  const downloadVideo = async (URL) => {
    if (!URL) return console.error("No video URL provided.");
    try {
      window.open(URL, "_blank");
    } catch (err) {
      console.error("Failed to open video in new tab", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-600" />
          Short Video Ad
          {showSaved && (
            <span className="text-green-600 text-sm font-medium ml-2">Saved</span>
          )}
        </h3>
      </div>

      <div className="max-w-2xl">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Video Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Editable Overlay Text Section */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="overlay">Overlay Text</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-sm text-gray-600 hover:text-purple-600"
                  onClick={() => handleCopy(overlayText)}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <Input
                id="overlay"
                value={overlayText}
                onChange={(e) => handleOverlayChange(e.target.value)}
                placeholder="Text to overlay on video"
              />
            </div>

            {/* Video Preview Section */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Video Preview</Label>
                {videoAd.video_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadVideo(videoAd.video_url)}
                    className="bg-white shadow hover:bg-gray-100 text-sm"
                  >
                    <Download className="w-4 h-4 mr-2 text-gray-700" />
                    Download Video
                  </Button>
                )}
              </div>

              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-200 relative">
                <div className="text-center w-full h-full">
                  {videoAd.video_url ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <video className="w-full h-full object-cover" controls>
                        <source src={videoAd.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      {overlayText && (
                        <div className="absolute bottom-16 left-4 text-white font-extrabold text-3xl leading-tight drop-shadow-md uppercase z-10">
                          {overlayText}
                        </div>
                      )}

                      <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-10">
                        <img src={visalogo} alt="VISA" className="h-6 md:h-8" />
                        <img
                          src={banklogo}
                          alt="Partner Logo"
                          className="h-6 md:h-8"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Play className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                      <p className="text-purple-600 font-medium">Video Preview</p>
                      <p className="text-sm text-gray-500 mt-1">
                        15-second video ad
                      </p>
                      {overlayText && (
                        <div className="mt-4 px-4 py-2 bg-black/80 text-white text-sm rounded">
                          {overlayText}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
