import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";
import showBigToast from "../components/showBigToast";

export const useMessageStore = create((set) => ({
  messages: [],
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

      toast.success("Message sent!");
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

    if (message.sender !== currentUserId) {
      console.log("📥 Recibido mensaje de otro usuario:", message);
      showBigToast(`Nuevo mensaje: ${message.content}`);
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
}));
