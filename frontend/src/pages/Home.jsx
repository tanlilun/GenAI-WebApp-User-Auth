import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuthStore } from "../store/authStore";
import { Campaign, AssetSet } from "../store/entities";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Sparkles, Zap, ArrowRight, Play } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import AssetAccordion from "../components/assets/AssetAccordion";

export default function Home() {
  const [latestCampaign, setLatestCampaign] = useState(null);
  const [latestAssetSet, setLatestAssetSet] = useState(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadLatest();
    const interval = setInterval(loadLatest, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadLatest = async () => {
    try {
      const [campaigns, assetSets] = await Promise.all([
        Campaign.getState().list("createdAt"),
        AssetSet.getState().list("createdAt"),
      ]);

      const completed = campaigns
        .filter((c) => c.status === "completed")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (!completed.length) return;

      const latest = completed[0];
      const assetMap = assetSets.reduce((acc, a) => {
        acc[a.campaign_id] = a;
        return acc;
      }, {});
      const asset = assetMap[latest._id];
      if (!asset) return;

      setLatestCampaign(latest);
      setLatestAssetSet(asset);
    } catch (error) {
      console.error("Error loading latest campaign:", error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        await isAuthenticated;
      } catch {
        console.log("User not authenticated");
      }
    };
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex flex-col items-center justify-start p-6 md:p-8">
      <div className="w-full max-w-6xl text-center">
        {/* Welcome Section */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-6">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Generate complete marketing asset sets in seconds. From social captions to display ads,
          let AI handle your creative workflow.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Link to={createPageUrl("Generate")}>
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              New Campaign
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
          <Link to={createPageUrl("Assets")}>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 border-2 hover:bg-gray-50 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              View All Campaigns
            </Button>
          </Link>
        </div>

        {/* Latest Campaign Section */}
        {latestCampaign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex justify-center"
          >
            <div className="w-full max-w-5xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-left">
                Last Campaign Generated:
              </h2>

              <Card className="w-full border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden flex flex-col">
                <CardHeader className="p-6 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-r from-purple-500 to-pink-500">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2 text-left">
                        {latestCampaign.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                          {latestCampaign.theme}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(latestCampaign.createdAt), "MMM d, yyyy")}
                        </Badge>
                      </div>
                      {latestCampaign.target_audience && (
                        <Badge variant="secondary" className="text-xs">
                          <Target className="w-2 h-2 mr-1" />
                          {latestCampaign.target_audience}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 flex-1 overflow-hidden">
                  {latestAssetSet && (
                    <div className="w-full">
                      <AssetAccordion
                        assetSet={latestAssetSet}
                        onUpdateAssetSet={(updated) => setLatestAssetSet(updated)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
