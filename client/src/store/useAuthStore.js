import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  signUp: async (data) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      toast.success("Usuario creado con éxito", {
        duration: 4000,
        position: "top-right",
      });
    } catch (error) {
      toast.error(error.response.data.message || "Error al crear el usuario");
    } finally {
      set({ loading: false });
    }
  },
  login: async (data) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", data);
      console.log("RES", res.data.user);
      set({ authUser: res.data.user });
    } catch (error) {
      toast.error(error.response.data.message || "Error al iniciar sesión");
    } finally {
      set({ loading: false });
    }
  },
  checkgAuthUser: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
      toast.error(
        error.response.data.message || "Error al verificar el usuario"
      );
    } finally {
      set({ checkingAuth: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message || "Error al cerrar sesión");
    }
  },
}));
