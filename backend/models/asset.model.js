import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    campaign_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Campaign', 
      required: true,
    },
    captions: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    images: {
      url: { type: String, default: "" },
      prompt: { type: String, default: "" },
    },
    newsletter: {
      subject: { type: String, default: "" },
      headline: { type: String, default: "" },
      caption: { type: String, default: "" },
      cta: { type: String, default: "" },
      point1: { type: String, default: "" },
      description1: { type: String, default: "" },
      point2: { type: String, default: "" },
      description2: { type: String, default: "" },
    },
    ads: {
      leaderboard: {
        leaderBoard1: { type: String, default: "" },
        leaderBoard2: { type: String, default: "" },
        leaderBoard3: { type: String, default: "" },
      },
      billboard: {
        billBoard1: { type: String, default: "" },
        billBoard2: { type: String, default: "" },
        billBoard3: { type: String, default: "" },
      },
      halfpage: {
        halfPage1: { type: String, default: "" },
        halfPage2: { type: String, default: "" },
        halfPage3: { type: String, default: "" },
      },
    },
    video_ad: {
      script: { type: String, default: "" },
      overlay_text: { type: String, default: "" },
      video_url: { type: String, default: "" },
    },
  },
  {
    timestamps: true, // replaces created_date and adds updatedAt
  }
);

export const Asset = mongoose.model("Asset", assetSchema);
