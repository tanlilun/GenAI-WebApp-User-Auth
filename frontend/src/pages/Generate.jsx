import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Campaign, AssetSet } from "../store/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const BANK_PRODUCT = [
  "Credit Card",
  "Financial Insurance",
  "Personal Loan",
  "Savings Account",
];

const AUDIENCE_OPTIONS = [
  "Students (18-24 years old)",
  "Young Professionals (25-35 years old)",
  "Travel Enthusiasts",
  "Empty Nesters",
];

const CAMPAIGN_THEMES = [
  "Family",
  "Travel Rewards",
  "Dining Experience",
  "Retail & Entertainment",
];

export default function Generate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bank_product: "",
    target_audience: "",
    theme: "",
    description: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  async function generateAssets() {
    if (!formData.name || !formData.theme || !formData.target_audience) {
      return;
    }

    setIsGenerating(true);
    setGenerationStep("Creating campaign...");

    try {
      const campaign = await Campaign.getState().create({
        name: formData.name,
        bank_product: formData.bank_product,
        theme: formData.theme,
        target_audience: formData.target_audience,
        description: formData.description,
        captions_status: "pending",
        newsletter_status: "pending",
        images_status: "pending",
        ads_leaderboard_1_status: "pending",
        ads_leaderboard_2_status: "pending",
        ads_leaderboard_3_status: "pending",
        ads_billboard_1_status: "pending",
        ads_billboard_2_status: "pending",
        ads_billboard_3_status: "pending",
        ads_half_page_1_status: "pending",
        ads_half_page_2_status: "pending",
        ads_half_page_3_status: "pending",
        video_status: "pending",
        status: "generating",
      });

      setGenerationStep("Generating social media captions...");
      await Campaign.getState().update(campaign._id, {
        captions_status: "generating",
      });
      await waitForStatus(campaign._id, "captions_status", "completed");

      setGenerationStep("Creating newsletter content...");
      await Campaign.getState().update(campaign._id, {
        newsletter_status: "generating",
      });
      await waitForStatus(campaign._id, "newsletter_status", "completed");

      setGenerationStep("Generating relevant image...");
      await Campaign.getState().update(campaign._id, {
        images_status: "generating",
      });
      await waitForStatus(campaign._id, "images_status", "completed");

      setGenerationStep("Creating Ad Banners...");
      const adFields = [
        "ads_leaderboard_1_status",
        "ads_leaderboard_2_status",
        "ads_leaderboard_3_status",
        "ads_billboard_1_status",
        "ads_billboard_2_status",
        "ads_billboard_3_status",
        "ads_half_page_1_status",
        "ads_half_page_2_status",
        "ads_half_page_3_status",
      ];

      await Campaign.getState().update(campaign._id, Object.fromEntries(adFields.map(f => [f, "generating"])));
      for (let field of adFields) {
        await waitForStatus(campaign._id, field, "completed");
      }

      setGenerationStep("Creating short video...");
      await Campaign.getState().update(campaign._id, {
        video_status: "generating",
      });
      await waitForStatus(campaign._id, "video_status", "completed");

      await Campaign.getState().update(campaign._id, { status: "completed" });
      setGenerationStep("All assets generated!");
      await AssetSet.list("-created_date");

      navigate(createPageUrl("Assets"));
    } catch (error) {
      console.error("Error generating assets:", error);
      setGenerationStep(error.message || "Error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
      navigate(createPageUrl("Assets"));
    }
  }

  function waitForStatus(campaignId, statusField, expectedStatus, timeout = 120000, interval = 2000) {
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
      const timer = setInterval(async () => {
        try {
          const campaign = await Campaign.getById(campaignId);
          if (campaign[statusField] === expectedStatus) {
            clearInterval(timer);
            resolve();
          } else if (campaign[statusField] === "error") {
            clearInterval(timer);
            reject(new Error(`Error in ${statusField.replace("_status", "")} generation.`));
          } else if (Date.now() - startTime > timeout) {
            clearInterval(timer);
            reject(new Error(`${statusField.replace("_status", "")} generation timed out.`));
          }
        } catch (err) {
          clearInterval(timer);
          reject(err);
        }
      }, interval);
    });
  }

  const renderSelectButtons = (label, options, field) => (
    <div className="space-y-2">
      <Label className="text-base font-medium">{label}</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFormData({ ...formData, [field]: option })}
            className={`px-3 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium border transition-all duration-200 ${
              formData[field] === option
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "bg-white hover:bg-purple-50 border-gray-300 text-gray-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Home"))}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
              Generate Marketing Assets
            </h1>
            <p className="text-gray-600 mt-2">
              Create a complete set of AI-powered marketing materials
            </p>
          </div>
        </div>

        {!isGenerating ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    Campaign Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your campaign name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                {renderSelectButtons("Bank Product", BANK_PRODUCT, "bank_product")}
                {renderSelectButtons("Target Audience", AUDIENCE_OPTIONS, "target_audience")}
                {renderSelectButtons("Campaign Theme", CAMPAIGN_THEMES, "theme")}

                {/* Generate Button */}
                <div className="pt-6">
                  <Button
                    onClick={generateAssets}
                    disabled={!formData.name || !formData.theme || !formData.target_audience}
                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    Generate Complete Asset Set
                    <TrendingUp className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20">
            <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Assets</h3>
                <p className="text-gray-600 mb-4">{generationStep}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full w-3/4 transition-all duration-300"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4">This may take 30–60 seconds</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
