import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { CheckCircle, XCircle, Flame } from "lucide-react";

const playSound = () => {
  const audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0.7;
  audio.play().catch((err) => console.warn("No se pudo reproducir el sonido", err));
};

const showBigToast = (message, type = "success") => {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ["#FF5864", "#FFB6C1", "#FFD1DC"],
  });

  playSound();

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 bg-white border border-[#FFB6C1] shadow-xl rounded-xl px-6 py-5 w-[350px] sm:w-[420px] flex items-center space-x-4`}
      >
        <div className="text-[#FF5864]">
          {type === "success" && <CheckCircle size={32} />}
          {type === "error" && <XCircle size={32} />}
          {type === "notify" && <Flame size={32} />}
        </div>

        <div className="flex-1 text-gray-800 text-base font-medium">{message}</div>
      </div>
    ),
    { duration: 5000 }
  );
};

export default showBigToast;
