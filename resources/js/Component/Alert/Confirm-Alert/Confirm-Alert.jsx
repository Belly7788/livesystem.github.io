import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getDarkModeClass } from "../../../utils/darkModeUtils";
import { FiAlertCircle } from "react-icons/fi";
import Spinner from "../../Loading/spinner/spinner";

function ConfirmAlert({ isOpen, onClose, onConfirm, title, message, darkMode, isLoading = false }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes showAlert {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-show-alert {
        animation: showAlert 0.3s ease-in-out forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onConfirm();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 confirm-alert">
      <div
        className={`rounded-lg p-6 shadow-xl w-96 transform transition-all duration-300 ease-in-out ${
          isClosing
            ? "scale-95 opacity-0"
            : "scale-100 opacity-100 animate-show-alert"
        } ${getDarkModeClass(
          darkMode,
          "bg-gray-800 text-white border border-gray-700",
          "bg-white text-gray-800 border border-gray-200"
        )}`}
      >
        <div className="flex items-center mb-4">
          <FiAlertCircle
            className={`mr-2 h-6 w-6 ${getDarkModeClass(
              darkMode,
              "text-[#ff8800]",
              "text-[#ff8800]"
            )}`}
          />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="mb-6 text-sm">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${getDarkModeClass(
              darkMode,
              "bg-gray-600 hover:bg-gray-700 text-white",
              "bg-gray-200 hover:bg-gray-300 text-gray-800"
            )}`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md border transition-colors duration-200 flex items-center justify-center ${getDarkModeClass(
              darkMode,
              "border-[#ff8800] text-[#ff8800] hover:bg-[#ff8800] hover:text-white",
              "border-[#ff8800] text-[#ff8800] hover:bg-[#ff8800] hover:text-white"
            )} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <Spinner width="16px" height="16px" className="mr-2" />
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function showConfirmAlert({ title, message, onConfirm, darkMode = false, isLoading = false }) {
  return new Promise((resolve) => {
    const AlertWrapper = () => {
      const [isOpen, setIsOpen] = React.useState(true);

      const handleClose = () => {
        setIsOpen(false);
        resolve(false);
      };

      const handleConfirm = () => {
        setIsOpen(false);
        onConfirm();
        resolve(true);
      };

      return (
        <ConfirmAlert
          isOpen={isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={title}
          message={message}
          darkMode={darkMode}
          isLoading={isLoading}
        />
      );
    };

    const mountPoint = document.createElement("div");
    document.body.appendChild(mountPoint);

    const root = createRoot(mountPoint);
    root.render(<AlertWrapper />);

    return () => {
      root.unmount();
      document.body.removeChild(mountPoint);
    };
  });
}

export { showConfirmAlert };
