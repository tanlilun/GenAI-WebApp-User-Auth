import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Campaign, AssetSet } from "../store/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const BANK_PRODUCT = [
  // "Credit Card",
  "Bank Insurance",
  "Personal Loan",
  "Housing Loan",
  "Life Insurance",
];

const AUDIENCE_OPTIONS = [
  { label: "Students", subLabel: "(18-24 years old)" },
  { label: "Young Professionals", subLabel: "(25-35 years old)" },
  { label: "Travel Enthusiasts", subLabel: "" },
  { label: "Empty Nesters", subLabel: "" },
];

const CAMPAIGN_THEMES = [
  "Wellness",
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function generateAssets() {
    if (!formData.name || !formData.theme || !formData.target_audience) {
      return;
    }

    try {
      await Campaign.getState().create({
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

      setIsSubmitted(true);
      await AssetSet.getState().list("createdAt");
    } catch (error) {
      console.error("Error submitting generation request:", error);
      alert("Failed to submit generation request. Please try again.");
    }
  }

  const renderSelectButtons = (label, options, field) => (
    <div className="space-y-2">
      <Label className="text-base font-medium">{label}</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((option) => {
          const value = option.label || option;
          const isDisabled = label === "Bank Product" && value !== "Bank Insurance";

          return (
            <button
              key={value}
              type="button"
              disabled={isDisabled}
              onClick={() =>
                !isDisabled && setFormData({ ...formData, [field]: value })
              }
              className={`px-3 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium border transition-all duration-200 text-center ${
                formData[field] === value
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : isDisabled
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-purple-50 border-gray-300 text-gray-700"
              }`}
            >
              <span className="block">{option.label || option}</span>
              {option.subLabel && (
                <span className="block text-xs text-gray-500">
                  {option.subLabel}
                </span>
              )}
            </button>
          );
        })}
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

        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    Campaign Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your campaign name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-12 text-base"
                  />
                </div>

                {renderSelectButtons("Bank Product", BANK_PRODUCT, "bank_product")}
                {renderSelectButtons("Target Audience", AUDIENCE_OPTIONS, "target_audience")}
                {renderSelectButtons("Campaign Theme", CAMPAIGN_THEMES, "theme")}

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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm text-center p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Request Submitted
              </h3>
              <p className="text-gray-600 mb-6">
                Your generation request has been submitted. Click below to view your assets.
              </p>
              <Button
                onClick={() => navigate(createPageUrl("Assets"))}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg text-lg"
              >
                Go to Assets
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
