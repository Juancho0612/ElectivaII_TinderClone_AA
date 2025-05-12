import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const playSound = () => {
  const audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0.7;
  audio.play().catch((err) => console.warn("No se pudo reproducir el sonido", err));
};

const showBigToast = (message, type = "success") => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  playSound();

  toast.custom(
    (t) => (
      <div
        className={`${
          type === "success" ? "bg-green-600" : "bg-red-600"
        } text-white px-6 py-5 rounded-xl shadow-2xl border-4 border-white w-[350px] sm:w-[450px] font-semibold flex items-center justify-between space-x-3 animate-fade-in ${
          t.visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{type === "success" ? "🎉" : "⚠️"}</span>
          <div className="text-lg">{message}</div>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
};

export default showBigToast;
