import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getDarkModeClass } from "../../../utils/darkModeUtils";
import { FiAlertCircle, FiX } from "react-icons/fi";

function ErrorAlert({ isOpen, onClose, title, message, darkMode, buttons = [], timeout = 3000 }) {
    const [isClosing, setIsClosing] = useState(false);

    // Inject CSS for animations (same as SuccessAlert)
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-100%);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-100%);
                }
            }
            .animate-slide-down {
                animation: slideDown 0.3s ease-in-out forwards;
            }
            .animate-slide-up {
                animation: slideUp 0.3s ease-in-out forwards;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Auto-close after timeout (same as SuccessAlert)
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                handleClose();
            }, timeout);
            return () => clearTimeout(timer);
        }
    }, [isOpen, timeout]);

    // Handle closing with animation
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300); // Match animation duration
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6 pointer-events-none">
            <div
                className={`rounded-lg p-4 shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out pointer-events-auto ${
                    isClosing ? "animate-slide-up" : "animate-slide-down"
                } ${getDarkModeClass(
                    darkMode,
                    "bg-gray-800 text-white border border-gray-700",
                    "bg-red-100 text-red-800 border border-red-200"
                )}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FiAlertCircle
                            className={`h-5 w-5 ${getDarkModeClass(
                                darkMode,
                                "text-red-400",
                                "text-red-600"
                            )}`}
                        />
                        <span className="text-sm font-medium">{message}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {buttons.map((button, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    button.onClick();
                                    handleClose();
                                }}
                                className={`px-4 py-1 rounded-md transition-colors duration-200 ${getDarkModeClass(
                                    darkMode,
                                    "bg-gray-600 hover:bg-gray-700 text-white",
                                    "bg-red-200 hover:bg-red-300 text-red-800"
                                )}`}
                            >
                                {button.text || "Close"}
                            </button>
                        ))}
                        <button onClick={handleClose}>
                            <FiX
                                className={`h-5 w-5 ${getDarkModeClass(
                                    darkMode,
                                    "text-gray-400 hover:text-gray-200",
                                    "text-red-600 hover:text-red-800"
                                )}`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function showErrorAlert({ title, message, darkMode = false, buttons = [], timeout = 3000 }) {
    return new Promise((resolve) => {
        const AlertWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            const handleClose = () => {
                setIsOpen(false);
                resolve(false);
            };

            return (
                <ErrorAlert
                    isOpen={isOpen}
                    onClose={handleClose}
                    title={title}
                    message={message}
                    darkMode={darkMode}
                    buttons={buttons}
                    timeout={timeout}
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

export { showErrorAlert };

