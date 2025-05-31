import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";
import showBigToast from "../components/showBigToast";

export const useMessageStore = create((set) => ({
  messages: [],
  notifications: [],
  loading: true,

  sendMessage: async (receiverId, content) => {
    try {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            _id: Date.now(),
            sender: useAuthStore.getState().authUser._id,
            content,
          },
        ],
      }));

      const token = localStorage.getItem("jwt");
      await axiosInstance.post(
        "/messages/send",
        { receiverId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  getMessages: async (userId) => {
    try {
      set({ loading: true });

      const token = localStorage.getItem("jwt");
      const res = await axiosInstance.get(`/messages/conversation/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ messages: res.data.messages });
    } catch (error) {
      console.error(error);
      set({ messages: [] });
    } finally {
      set({ loading: false });
    }
  },

  subscribeToMessages: () => {
    let socket;
    try {
      socket = getSocket();
    } catch (error) {
      console.warn("⚠️ Socket no inicializado:", error);
      return;
    }

    socket.off("newMessage");

    socket.on("newMessage", ({ message }) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));

      const currentUserId = useAuthStore.getState().authUser?._id;
      const currentUserName = useAuthStore.getState().authUser?.name;

      if (message.sender !== currentUserId) {
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: Date.now(),
              type: "message",
              sender: currentUserName,
              content: message.content,
            },
          ],
        }));
        showBigToast(
          `Mensaje enviado de ${currentUserName}: ${message.content}`
        );
      }
    });
  },

  unsubscribeFromMessages: () => {
    let socket;
    try {
      socket = getSocket();
      socket.off("newMessage");
    } catch (error) {
      console.warn(
        "⚠️ No se pudo desuscribir: el socket no estaba inicializado: ",
        error
      );
    }
  },

  removeNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== notificationId
      ),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },
}));
