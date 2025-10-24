// import { base44 } from './base44Client';

// export const Campaign = base44.entities.Campaign;

// export const AssetSet = base44.entities.AssetSet;

// @/api/entities/Campaign.js

import { create } from "zustand";

import axios from "axios";

axios.defaults.withCredentials = true;

const API_BASE = import.meta.env.MODE === "development" ? "http://localhost:5000/api/campaign" : "/api/campaign";

export const Campaign = create((set) => ({
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,
  message: null,

  // List all campaigns
  list: async (sort = '') => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}`, {
        params: sort ? { sort } : {},
      });
      set({ campaigns: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Error fetching campaigns";
      set({ error: msg, isLoading: false });
      return [];
    }
  },

  // Get campaign by ID
  getById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/${id}`);
      set({ selectedCampaign: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Error fetching campaign";
      set({ error: msg, isLoading: false });
      return null;
    }
  },

  // Create campaign
  create: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(API_BASE, data, {
        headers: { "Content-Type": "application/json" },
      });
      set((state) => ({
        campaigns: [...state.campaigns, res.data],
        message: "Campaign created successfully",
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Error creating campaign";
      set({ error: msg, isLoading: false });
      return null;
    }
  },

  // Update campaign
  update: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`${API_BASE}/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c._id === id ? res.data : c
        ),
        message: "Campaign updated successfully",
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Error updating campaign";
      set({ error: msg, isLoading: false });
      return null;
    }
  },

  // Delete campaign
  delete: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.delete(`${API_BASE}/${id}`);
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c._id !== id),
        message: "Campaign deleted successfully",
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Error deleting campaign";
      set({ error: msg, isLoading: false });
      return null;
    }
  },
}));


// frontend/api/Asset.js (or wherever your front-end code resides)

const Asset_API = import.meta.env.MODE === "development" ? "http://localhost:5000/api/asset" : "/api/asset";

export const AssetSet = create((set, get) => ({
  assets: [],
  selectedAsset: null,
  isLoading: false,
  error: null,
  message: null,

  // List all assets (with optional sort)
  list: async (sort = '') => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(Asset_API, { params: sort ? { sort } : {} });
      set({ assets: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      console.error("Error listing assets:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Error fetching assets", isLoading: false });
      return [];
    }
  },

  // Get asset by ID
  getById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${Asset_API}/${id}`);
      set({ selectedAsset: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      console.error("Error fetching asset:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Error fetching asset", isLoading: false });
      return null;
    }
  },

  // Create a new asset
  create: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(Asset_API, data, {
        headers: { "Content-Type": "application/json" },
      });
      set((state) => ({
        assets: [...state.assets, res.data],
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      console.error("Error creating asset:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error creating asset",
        isLoading: false,
      });
      return null;
    }
  },

  // Update asset
  update: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`${Asset_API}/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      set((state) => ({
        assets: state.assets.map((a) => (a._id === id ? res.data : a)),
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      console.error("Error updating asset:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error updating asset",
        isLoading: false,
      });
      return null;
    }
  },

  // Delete asset
  delete: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.delete(`${Asset_API}/${id}`);
      set((state) => ({
        assets: state.assets.filter((a) => a._id !== id),
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      console.error("Error deleting asset:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error deleting asset",
        isLoading: false,
      });
      return null;
    }
  },
}));

  
// auth sdk:
// export const User = base44.auth;