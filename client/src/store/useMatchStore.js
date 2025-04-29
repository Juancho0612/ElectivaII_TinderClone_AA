import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useMatchStore = create((set) => ({
  matches: [],
  isLoadingMyMatches: false,
  isLoadingUserProfiles: false,
  userProfiles: [],
  swipeFeedback: null,

  getMyMatches: async () => {
    try {
      set({ isLoadingMyMatches: true });
      const res = await axiosInstance.get("/matches");
      set({ matches: res.data.matches });
    } catch (error) {
      set({ matches: [] });
      toast.error(
        error.response.data.message || "Ocurrió un error al obtener los matches"
      );
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },

  getUserProfiles: async () => {
    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: res.data.users });
    } catch (error) {
      set({ userProfiles: [] });
      toast.error(
        error.response.data.message ||
          "Ocurrió un error al obtener los usuarios"
      );
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },

  swipeLeft: async (user) => {
    try {
      set({ swipeFeedback: "passed" });
      await axiosInstance.post("/matches/swipe-left/" + user._id);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrio un error al dar dislike");
    } finally {
      setTimeout(() => set({ swipeFeedback: null }), 1500);
    }
  },
  swipeRight: async (user) => {
    try {
      set({ swipeFeedback: "liked" });
      await axiosInstance.post("/matches/swipe-right/" + user._id);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrio un error al dar like");
    } finally {
      setTimeout(() => set({ swipeFeedback: null }), 1500);
    }
  },
}));
