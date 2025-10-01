import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bank_product: String,
  theme: String,
  target_audience: String,
  // Associate campaign with a user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  captions_status: { type: String, default: 'pending' },
  newsletter_status: { type: String, default: 'pending' },
  images_status: { type: String, default: 'pending' },
  ads_leaderboard_1_status: { type: String, default: 'pending' },
  ads_leaderboard_2_status: { type: String, default: 'pending' },
  ads_leaderboard_3_status: { type: String, default: 'pending' },
  ads_billboard_1_status: { type: String, default: 'pending' },
  ads_billboard_2_status: { type: String, default: 'pending' },
  ads_billboard_3_status: { type: String, default: 'pending' },
  ads_half_page_1_status: { type: String, default: 'pending' },
  ads_half_page_2_status: { type: String, default: 'pending' },
  ads_half_page_3_status: { type: String, default: 'pending' },
  video_status: { type: String, default: 'pending' },
  status: { type: String, default: 'generating' },
}, {
  timestamps: true,
});

export const Campaign = mongoose.model('Campaign', campaignSchema);
