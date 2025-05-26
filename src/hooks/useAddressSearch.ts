import { useCallback, useEffect, useReducer, useRef } from "react";
import type { Address, SearchState, SearchConfig } from "../types/address";

// Actions pour le reducer
type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_RESULTS"; payload: Address[] }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_SHOW_RESULTS"; payload: boolean }
  | { type: "SET_SELECTED_ADDRESS"; payload: Address | null }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_AUTOCOMPLETE"; payload: boolean }
  | { type: "CLEAR_SEARCH" }
  | { type: "RESET_ERROR" };

// État initial
const initialState: SearchState = {
  query: "",
  results: [],
  loading: false,
  error: "",
  showResults: false,
  selectedAddress: null,
  limit: 10,
  autocomplete: true,
};

// Reducer pour gérer l'état
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_RESULTS":
      return { ...state, results: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SHOW_RESULTS":
      return { ...state, showResults: action.payload };
    case "SET_SELECTED_ADDRESS":
      return { ...state, selectedAddress: action.payload };
    case "SET_LIMIT":
      return { ...state, limit: action.payload };
    case "SET_AUTOCOMPLETE":
      return { ...state, autocomplete: action.payload };
    case "CLEAR_SEARCH":
      return {
        ...state,
        query: "",
        results: [],
        showResults: false,
        selectedAddress: null,
        error: "",
      };
    case "RESET_ERROR":
      return { ...state, error: "" };
    default:
      return state;
  }
}

const defaultConfig: SearchConfig = {
  debounceMs: 300,
  minQueryLength: 3,
  defaultLimit: 10,
  enableGeolocation: true,
  enableHistory: true,
  enableFavorites: true,
};

export function useAddressSearch(config: Partial<SearchConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const debounceRef = useRef<number | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fonction principale de recherche
  const searchAddresses = useCallback(
    async (
      searchQuery: string,
      searchLimit: number = finalConfig.defaultLimit
    ) => {
      if (
        !searchQuery.trim() ||
        searchQuery.length < finalConfig.minQueryLength
      ) {
        dispatch({ type: "SET_RESULTS", payload: [] });
        dispatch({ type: "SET_SHOW_RESULTS", payload: false });
        return;
      }

      // Annuler la requête précédente
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Créer un nouveau contrôleur d'annulation
      abortControllerRef.current = new AbortController();

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "RESET_ERROR" });

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          limit: searchLimit.toString(),
          format: "json",
          autocomplete: state.autocomplete ? "1" : "0",
        });

        const apiUrl = `https://api-adresse.data.gouv.fr/search/?${params}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          signal: abortControllerRef.current.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        dispatch({ type: "SET_RESULTS", payload: data.features || [] });
        dispatch({ type: "SET_SHOW_RESULTS", payload: true });
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          dispatch({
            type: "SET_ERROR",
            payload: "Erreur lors de la recherche. Veuillez réessayer.",
          });
          console.error("Erreur de recherche:", err);
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.autocomplete, finalConfig.defaultLimit, finalConfig.minQueryLength]
  );

  // Debounce pour la recherche automatique
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current !== undefined) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = window.setTimeout(() => {
        searchAddresses(searchQuery, state.limit);
      }, finalConfig.debounceMs);
    },
    [searchAddresses, state.limit, finalConfig.debounceMs]
  );

  // Effet pour la recherche en temps réel
  useEffect(() => {
    // Ne pas faire de recherche si une adresse est déjà sélectionnée
    if (
      state.selectedAddress &&
      state.query === state.selectedAddress.properties.label
    ) {
      return;
    }

    if (
      state.autocomplete &&
      state.query.length >= finalConfig.minQueryLength
    ) {
      debouncedSearch(state.query);
    } else if (state.query.length < finalConfig.minQueryLength) {
      dispatch({ type: "SET_RESULTS", payload: [] });
      dispatch({ type: "SET_SHOW_RESULTS", payload: false });
      dispatch({ type: "SET_SELECTED_ADDRESS", payload: null });
    }

    return () => {
      if (debounceRef.current !== undefined) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    state.query,
    state.autocomplete,
    state.selectedAddress,
    debouncedSearch,
    finalConfig.minQueryLength,
  ]);

  // Sélection d'une adresse
  const selectAddress = useCallback((address: Address) => {
    dispatch({ type: "SET_SELECTED_ADDRESS", payload: address });
    dispatch({ type: "SET_QUERY", payload: address.properties.label });
    dispatch({ type: "SET_SHOW_RESULTS", payload: false });
    dispatch({ type: "SET_RESULTS", payload: [] });

    // Annuler toute recherche en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (debounceRef.current !== undefined) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  // Effacer la recherche
  const clearSearch = useCallback(() => {
    dispatch({ type: "CLEAR_SEARCH" });
    if (debounceRef.current !== undefined) {
      clearTimeout(debounceRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Gérer le changement de query
  const setQuery = useCallback(
    (newQuery: string) => {
      dispatch({ type: "SET_QUERY", payload: newQuery });

      // Réinitialiser la sélection si le texte ne correspond plus
      if (
        state.selectedAddress &&
        newQuery !== state.selectedAddress.properties.label
      ) {
        dispatch({ type: "SET_SELECTED_ADDRESS", payload: null });
      }
    },
    [state.selectedAddress]
  );

  // Setters pour les options
  const setLimit = useCallback((limit: number) => {
    dispatch({ type: "SET_LIMIT", payload: limit });
  }, []);

  const setAutocomplete = useCallback((autocomplete: boolean) => {
    dispatch({ type: "SET_AUTOCOMPLETE", payload: autocomplete });
  }, []);

  // Nettoyage des timers
  useEffect(() => {
    return () => {
      if (debounceRef.current !== undefined) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    searchAddresses,
    selectAddress,
    clearSearch,
    setQuery,
    setLimit,
    setAutocomplete,
    config: finalConfig,
  };
}
