import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (data) => {
    try {
      set({ loading: true });

      const token = localStorage.getItem("jwt");

      await axiosInstance.put(
        "/users/update", 
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Error al actualizar el perfil";
      toast.error(errMsg);
    } finally {
      set({ loading: false });
    }
  },
}));
