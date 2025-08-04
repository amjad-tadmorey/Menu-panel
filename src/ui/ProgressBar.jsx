import React, { useEffect, useState } from "react";

export default function ProgressBar({ progress, limit, title = "Progress" }) {
  const [displayedPercentage, setDisplayedPercentage] = useState(0);
  const targetPercentage = Math.min((progress / limit) * 100, 100);
  const isDanger = targetPercentage >= 80; // Danger threshold at 90%

  useEffect(() => {
    let interval;
    const duration = 800;
    const steps = 60;
    const increment = targetPercentage / steps;
    let current = 0;

    interval = setInterval(() => {
      current += increment;
      if (current >= targetPercentage) {
        current = targetPercentage;
        clearInterval(interval);
      }
      setDisplayedPercentage(current);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [targetPercentage]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>

      {/* Header */}
      <div className="mb-2 text-sm font-medium flex justify-between">
        <span className={isDanger ? "text-red-600 font-semibold" : "text-gray-700"}>
          {title}
        </span>
        <span className={isDanger ? "text-red-600 font-semibold" : "text-gray-700"}>
          {Math.floor(displayedPercentage)}%
        </span>
      </div>

      {/* Bar Background */}
      <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out shadow-lg"
          style={{
            width: `${displayedPercentage}%`,
            background: isDanger
              ? `linear-gradient(90deg, #FF6B6B, #FF0000)`
              : `linear-gradient(90deg, #6EC1F6, #00BFA6)`,
            boxShadow: isDanger
              ? `0 0 10px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 107, 107, 0.5)`
              : `0 0 10px rgba(0, 191, 166, 0.6), 0 0 20px rgba(110, 193, 246, 0.4)`,
            transition: "width 0.3s ease-out, box-shadow 0.5s ease-in-out",
          }}
        ></div>
      </div>

      {/* Footer */}
      <div
        className={`mt-2 text-xs text-center ${
          isDanger ? "text-red-500 font-medium" : "text-gray-500"
        }`}
      >
        {progress} / {limit}
        {isDanger && " — Almost full!"}
      </div>
    </div>
  );
}
