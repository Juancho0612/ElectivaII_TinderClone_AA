import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  signUp: async (data) => {
    try {
      await axiosInstance.post("/auth/signup", data);
  
      toast.success("Usuario creado con éxito", {
        duration: 4000,
        position: "top-right",
      });
    } catch (error) {
      let errMsg = "Error al crear el usuario";
      console.log(error);
      if (
        error?.response?.data?.message === "El correo eletronico ya existe"
      ) {
        errMsg = "Este correo ya está registrado";
      }
  
      toast.error(errMsg, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", loginData);

      localStorage.setItem("jwt", res.data.token);

      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("jwt");

      if (token) {
        await axiosInstance.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      localStorage.removeItem("jwt");
      disconnectSocket();
      set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },

  // Dentro de useAuthStore

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        set({ authUser: null, checkingAuth: false });
        return;
      }

      const res = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
      console.error(error);
    } finally {
      set({ checkingAuth: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ loading: true });
      await axiosInstance.post("/auth/reset-password", { email });
      toast.success("Correo de recuperación enviado", {
        duration: 4000,
        position: "top-right",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al recuperar la contraseña",
        {
          duration: 4000,
          position: "top-right",
        }
      );
    } finally {
      set({ loading: false });
    }
  },

  setAuthUser: (user) => set({ authUser: user }),
}));
