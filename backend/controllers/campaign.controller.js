import { Campaign } from '../models/campaign.model.js';
import { Asset } from '../models/asset.model.js';

import dotenv from "dotenv";

dotenv.config();

export const CampaignController = {
  list: async (req, res) => {
    try {
      const sort = req.query.sort;
      const campaigns = await Campaign.find({ user: req.userId }).sort(
        sort === 'asc' ? { name: 1 } :
        sort === 'desc' ? { name: -1 } :
        {}
      );
      res.json(campaigns);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error fetching campaigns' });
    }
  },  

  getById: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({ _id: req.params.id, user: req.userId });
      if (!campaign) return res.status(404).json({ message: 'Not found' });
      res.json(campaign);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error fetching campaign' });
    }
  },

  create: async (req, res) => {
    try {
      const campaign = new Campaign(req.body);
      campaign.user = req.userId;
      await campaign.save();

      // Create associated asset
      let asset;
      try {
        asset = await Asset.create({
          campaign_id: campaign._id,
          user: req.userId,
          captions: {},
          images: {},
          newsletter: {},
          ads: {},
          video_ad: {}
        });
      } catch (err) {
        console.error('Asset creation error:', err.message);
      }

      res.status(201).json({ campaign, asset });

      // Webhook trigger
      const webhookUrl = process.env.WEBHOOK_URL || 'https://rapidlab.app.n8n.cloud/webhook/generator';
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaign,
            asset
          }),
        });
      } catch (err) {
        console.error('Webhook error:', err.message);
      }
      
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error creating campaign' });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await Campaign.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error updating campaign' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Campaign.findOneAndDelete({ _id: req.params.id, user: req.userId });
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.json(deleted);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error deleting campaign' });
    }
  },
};
