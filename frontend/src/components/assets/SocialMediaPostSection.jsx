import React, { useState, useEffect, useCallback } from "react";
import { AssetSet } from "../../store/entities";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Linkedin, Instagram, Download, Copy, Check } from "lucide-react";
import FacebookPreview from "./previews/FacebookPreview";
import LinkedInPreview from "./previews/LinkedInPreview";
import InstagramPreview from "./previews/InstagramPreview";

export default function SocialMediaPostSection({ assetSet, onUpdateAssetSet }) {
  const selectedImage = assetSet.images;
  const selectedImageUrl = selectedImage?.url || "";

  const [captions, setCaptions] = useState({
    facebook: assetSet.captions?.facebook || "",
    linkedin: assetSet.captions?.linkedin || "",
    instagram: assetSet.captions?.instagram || "",
  });

  const { user, isAuthenticated } = useAuthStore();
  const [copied, setCopied] = useState(null);
  const [isDirty, setIsDirty] = useState(false); // track if edited
  const [showSaved, setShowSaved] = useState(false);
    
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        await isAuthenticated;
      } catch (error) {
        console.log("User not authenticated");
      }
    };
    loadUser();
  }, []);

  // Handle caption change
  const handleCaptionChange = (platform, value) => {
    setCaptions(prev => ({ ...prev, [platform]: value }));
    setIsDirty(true); // mark as edited
  };

  // Debounced auto-save function
  const saveCaptions = useCallback(async (updatedCaptions) => {
    if (!isDirty) return; // only save if edited
    try {
      const updatedAssetSet = {
        ...assetSet,
        captions: updatedCaptions,
      };
      await AssetSet.getState().update(assetSet._id, updatedAssetSet);
      onUpdateAssetSet(updatedAssetSet);
      setIsDirty(false);
      setShowSaved(true); // show saved notice
      setTimeout(() => setShowSaved(false), 3000); // hide after 3s
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [assetSet, onUpdateAssetSet, isDirty]);

  // Watch for caption changes and auto-save (debounce 2s)
  useEffect(() => {
    if (!isDirty) return; // do nothing unless edited
    const timeout = setTimeout(() => {
      saveCaptions(captions);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [captions, isDirty, saveCaptions]);

  const handleCopy = (text, platform) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = async (url, filename) => {
    if (!url) return console.error("No URL provided.");
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const downloadVideoPreview = (url) => {
    if (url) window.open(url, "_blank");
  };

  const platformTabs = [
    { name: "Facebook", icon: Facebook, value: "facebook" },
    { name: "LinkedIn", icon: Linkedin, value: "linkedin" },
    { name: "Instagram", icon: Instagram, value: "instagram" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
        Social Media Posts
        {showSaved && (
          <span className="text-green-600 text-sm font-medium ml-2">Saved</span>
        )}
      </h3>

      <Tabs defaultValue="facebook" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {platformTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              <tab.icon className="w-4 h-4" /> {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* --- FACEBOOK TAB --- */}
        <TabsContent value="facebook">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 items-start">
            <div>
              <div className="relative">
                <Textarea
                  value={captions.facebook}
                  onChange={e => handleCaptionChange("facebook", e.target.value)}
                  className="h-40 mb-8 pr-12"
                  placeholder="Write your Facebook caption..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-3 right-3"
                  onClick={() => handleCopy(captions.facebook, "facebook")}
                >
                  {copied === "facebook" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="relative mt-4 border rounded-lg bg-white overflow-hidden h-[400px] flex items-center justify-center shadow">
                {selectedImageUrl ? (
                  <img src={selectedImageUrl} alt="Campaign" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-sm">No image selected</div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 bg-white shadow hover:bg-gray-100"
                  onClick={() => handleDownload(selectedImageUrl, "facebook-image.png")}
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </Button>
              </div>
            </div>

            <div className="h-full">
              <FacebookPreview user={user} caption={captions.facebook} imageUrl={selectedImageUrl} />
            </div>
          </div>
        </TabsContent>

        {/* --- LINKEDIN TAB --- */}
        <TabsContent value="linkedin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 items-start">
            <div className="w-full">
              <div className="relative">
                <Textarea
                  value={captions.linkedin}
                  onChange={e => handleCaptionChange("linkedin", e.target.value)}
                  className="h-40 mb-8 pr-12 w-full"
                  placeholder="Write your LinkedIn caption..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-3 right-3"
                  onClick={() => handleCopy(captions.linkedin, "linkedin")}
                >
                  {copied === "linkedin" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="relative mt-4 border rounded-lg bg-white overflow-hidden h-auto md:h-[400px] flex items-center justify-center shadow w-full">
                {selectedImageUrl ? (
                  <img
                    src={selectedImageUrl}
                    alt="Campaign"
                    className="w-full h-auto max-h-[400px] object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No image selected</div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 bg-white shadow hover:bg-gray-100"
                  onClick={() => handleDownload(selectedImageUrl, "linkedin-image.png")}
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </Button>
              </div>
            </div>

            <div className="w-full mt-8 md:mt-0">
              <LinkedInPreview
                user={user}
                caption={captions.linkedin}
                imageUrl={selectedImageUrl}
              />
            </div>
          </div>
        </TabsContent>


        {/* --- INSTAGRAM TAB --- */}
        <TabsContent value="instagram">
          <div className="grid md:grid-cols-2 gap-8 mt-6 items-start">
            <div>
              <div className="relative">
                <Textarea
                  value={captions.instagram}
                  onChange={e => handleCaptionChange("instagram", e.target.value)}
                  className="h-40 mb-8 pr-12"
                  placeholder="Write your Instagram caption..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-3 right-3"
                  onClick={() => handleCopy(captions.instagram, "instagram")}
                >
                  {copied === "instagram" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="relative mt-4 border rounded-lg bg-white overflow-hidden h-[400px] flex items-center justify-center shadow">
                {assetSet.video_ad?.video_url ? (
                  <video
                    src={assetSet.video_ad.video_url}
                    controls
                    className="w-full h-full object-cover bg-black"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No video available</div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 bg-white shadow hover:bg-gray-100"
                  onClick={() => downloadVideoPreview(assetSet.video_ad?.video_url)}
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </Button>
              </div>
            </div>

            <div className="h-full">
              <InstagramPreview
                user={user}
                caption={captions.instagram}
                videoUrl={assetSet.video_ad?.video_url}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
