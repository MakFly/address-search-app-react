import { useState, useCallback, useEffect } from "react";
import type { Address, SearchHistory, FavoriteAddress } from "../types/address";

const HISTORY_KEY = "address-search-history";
const FAVORITES_KEY = "address-search-favorites";
const MAX_HISTORY_ITEMS = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistory[]>([]);

  // Charger l'historique depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    }
  }, []);

  // Ajouter une recherche à l'historique
  const addToHistory = useCallback((query: string, address: Address) => {
    const newItem: SearchHistory = {
      id: `${Date.now()}-${Math.random()}`,
      query,
      address,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // Supprimer les doublons basés sur l'adresse
      const filtered = prev.filter(
        (item) => item.address.properties.id !== address.properties.id
      );

      // Ajouter le nouvel élément au début et limiter la taille
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      // Sauvegarder dans localStorage
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'historique:", error);
      }

      return updated;
    });
  }, []);

  // Supprimer un élément de l'historique
  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'historique:", error);
      }

      return updated;
    });
  }, []);

  // Vider l'historique
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'historique:", error);
    }
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAddress[]>([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    }
  }, []);

  // Ajouter aux favoris
  const addToFavorites = useCallback((address: Address, nickname?: string) => {
    const newFavorite: FavoriteAddress = {
      id: `${Date.now()}-${Math.random()}`,
      address,
      nickname,
      timestamp: Date.now(),
    };

    setFavorites((prev) => {
      // Vérifier si l'adresse est déjà en favoris
      const exists = prev.some(
        (fav) => fav.address.properties.id === address.properties.id
      );

      if (exists) {
        return prev;
      }

      const updated = [...prev, newFavorite];

      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des favoris:", error);
      }

      return updated;
    });
  }, []);

  // Supprimer des favoris
  const removeFromFavorites = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((fav) => fav.id !== id);

      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des favoris:", error);
      }

      return updated;
    });
  }, []);

  // Vérifier si une adresse est en favoris
  const isFavorite = useCallback(
    (address: Address) => {
      return favorites.some(
        (fav) => fav.address.properties.id === address.properties.id
      );
    },
    [favorites]
  );

  // Mettre à jour le surnom d'un favori
  const updateFavoriteNickname = useCallback((id: string, nickname: string) => {
    setFavorites((prev) => {
      const updated = prev.map((fav) =>
        fav.id === id ? { ...fav, nickname } : fav
      );

      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des favoris:", error);
      }

      return updated;
    });
  }, []);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    updateFavoriteNickname,
  };
}
