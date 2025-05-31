import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import showBigToast from "../components/showBigToast";

export const useMatchStore = create((set) => ({
  matches: [],
  isLoadingMyMatches: false,
  isLoadingUserProfiles: false,
  userProfiles: [],
  swipeFeedback: null,

  getMyMatches: async () => {
    try {
      set({ isLoadingMyMatches: true });

      const token = localStorage.getItem("jwt");
      const res = await axiosInstance.get("/matches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ matches: res.data.matches });
    } catch (error) {
      set({ matches: [] });
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },

  getUserProfiles: async () => {
    try {
      set({ isLoadingUserProfiles: true });

      const token = localStorage.getItem("jwt");
      const res = await axiosInstance.get("/matches/user-profiles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ userProfiles: res.data.users });
    } catch (error) {
      set({ userProfiles: [] });
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },

  swipeLeft: async (user) => {
    try {
      set({ swipeFeedback: "passed" });

      const token = localStorage.getItem("jwt");
      await axiosInstance.post(
        `/matches/swipe-left/${user._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to swipe left");
    } finally {
      setTimeout(() => set({ swipeFeedback: null }), 1500);
    }
  },

  swipeRight: async (user) => {
    try {
      set({ swipeFeedback: "liked" });

      const token = localStorage.getItem("jwt");
      await axiosInstance.post(
        `/matches/swipe-right/${user._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to swipe right");
    } finally {
      setTimeout(() => set({ swipeFeedback: null }), 1500);
    }
  },

  subscribeToNewMatches: () => {
    try {
      const socket = getSocket();

      socket.on("newMatch", (newMatch) => {
        set((state) => ({
          matches: [...state.matches, newMatch],
        }));
        showBigToast("🔥 ¡Tienes un nuevo match!", "success");
      });
    } catch (error) {
      console.log(error);
    }
  },

  unsubscribeFromNewMatches: () => {
    try {
      const socket = getSocket();
      socket.off("newMatch");
    } catch (error) {
      console.error(error);
    }
  },
}));
