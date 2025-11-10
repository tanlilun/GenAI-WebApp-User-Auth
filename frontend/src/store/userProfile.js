import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/profile"
    : "/api/profile";

export const useProfileStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  message: null,

  // Fetch current user profile
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/me`, {
        headers: { "Content-Type": "application/json" },
      });
      set({ user: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Error fetching profile";
      set({ error: msg, isLoading: false });
      return null;
    }
  },

  // Update user profile
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`${API_BASE}/update`, data, {
        headers: { "Content-Type": "application/json" },
      });

      set({
        user: res.data.user,
        message: res.data.message,
        isLoading: false,
      });

      return res.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Error updating profile";
      set({ error: msg, isLoading: false });
      return null;
    }
  },
}));
