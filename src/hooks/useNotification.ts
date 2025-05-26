import { useCallback } from "react";

export const useNotification = () => {
  const showNotification = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const notification = document.createElement("div");
      notification.textContent = message;

      const baseClasses =
        "fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 text-white font-medium";
      const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
      };

      notification.className = `${baseClasses} ${typeClasses[type]}`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    },
    []
  );

  const copyToClipboard = useCallback(
    async (text: string, successMessage?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showNotification(
          successMessage || "Copié dans le presse-papiers !",
          "success"
        );
        return true;
      } catch {
        showNotification("Erreur lors de la copie", "error");
        return false;
      }
    },
    [showNotification]
  );

  return {
    showNotification,
    copyToClipboard,
  };
};
