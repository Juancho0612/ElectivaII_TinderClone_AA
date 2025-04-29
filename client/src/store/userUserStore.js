import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (data) => {
    try {
      set({ loading: true });
      await axiosInstance.put("/users/update", data);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error(
        error.response.data.message || "Error al actualizar el perfil"
      );
    } finally {
      set({ loading: false });
    }
  },
}));
