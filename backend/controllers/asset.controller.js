import { Asset } from '../models/asset.model.js';

export const AssetController = {
  list: async (req, res) => {
    try {
      const sort = req.query.sort;
      const assets = await Asset.find({ user: req.userId }).sort(
        sort === 'asc' ? { createdAt: 1 } :
        sort === 'desc' ? { createdAt: -1 } :
        {}
      );
      res.json(assets);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error fetching assets' });
    }
  },  

  getById: async (req, res) => {
    try {
      const asset = await Asset.findOne({ _id: req.params.id, user: req.userId });
      if (!asset) return res.status(404).json({ message: 'Not found' });
      res.json(asset);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error fetching asset' });
    }
  },

  create: async (data) => {
    try {
      if (!data.campaign_id) {
        console.warn('Missing campaign_id when creating asset.');
        return null;
      }

      data.user = req.userId;

      const assetData = {
        _id: data.campaign_id,
        user: req.userId,
        captions: {
          facebook: data.captions?.facebook || '',
          instagram: data.captions?.instagram || '',
          linkedin: data.captions?.linkedin || '',
          twitter: data.captions?.twitter || ''
        },
        images: {
          url: data.images?.url || '',
          prompt: data.images?.prompt || ''
        },
        newsletter: {
          subject: data.newsletter?.subject || '',
          headline: data.newsletter?.headline || '',
          caption: data.newsletter?.caption || '',
          cta: data.newsletter?.cta || '',
          point1: data.newsletter?.point1 || '',
          description1: data.newsletter?.description1 || '',
          point2: data.newsletter?.point2 || '',
          description2: data.newsletter?.description2 || ''
        },
        ads: {
          leaderboard: {
            leaderBoard1: data.ads?.leaderboard?.leaderBoard1 || '',
            leaderBoard2: data.ads?.leaderboard?.leaderBoard2 || '',
            leaderBoard3: data.ads?.leaderboard?.leaderBoard3 || '',
          },
          billboard: {
            billBoard1: data.ads?.billboard?.billBoard1 || '',
            billBoard2: data.ads?.billboard?.billBoard2 || '',
            billBoard3: data.ads?.billboard?.billBoard3 || '',
          },
          halfpage: {
            halfPage1: data.ads?.halfpage?.halfPage1 || '',
            halfPage2: data.ads?.halfpage?.halfPage2 || '',
            halfPage3: data.ads?.halfpage?.halfPage3 || '',
          },
        },
        video_ad: {
          script: data.video_ad?.script || '',
          overlay_text: data.video_ad?.overlay_text || '',
          video_url: data.video_ad?.video_url || ''
        }
        // No need to set created_date; Mongoose handles it via timestamps
      };

      const newAsset = await Asset.create(assetData);
      return newAsset;
    } catch (error) {
      console.error('Error creating asset:', error.message);
      return null;
    }
  },

  update: async (req, res) => {
    try {
      const updated = await Asset.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error updating asset' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Asset.findOneAndDelete({ _id: req.params.id, user: req.userId });
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.json(deleted);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error deleting asset' });
    }
  },
};
