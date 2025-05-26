import React, { memo, forwardRef } from "react";
import { Search, Loader2, X, Navigation } from "lucide-react";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
  autocomplete: boolean;
  placeholder?: string;
  onGeolocationClick?: () => void;
  geolocationLoading?: boolean;
}

export const SearchInput = memo(
  forwardRef<HTMLInputElement, SearchInputProps>(
    (
      {
        query,
        onQueryChange,
        onSearch,
        onClear,
        loading,
        autocomplete,
        placeholder = "Tapez une adresse (ex: 20 avenue de Ségur, Paris)",
        onGeolocationClick,
        geolocationLoading = false,
      },
      ref
    ) => {
      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (query.trim()) {
            onSearch();
          }
        }
      };

      return (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={ref}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg transition-all duration-200"
              autoComplete="off"
              aria-label="Recherche d'adresse"
              aria-describedby="search-help"
            />

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {onGeolocationClick && (
                <button
                  type="button"
                  onClick={onGeolocationClick}
                  disabled={geolocationLoading}
                  className="text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                  title="Utiliser ma position"
                  aria-label="Utiliser ma position actuelle"
                >
                  {geolocationLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Navigation className="h-5 w-5" />
                  )}
                </button>
              )}

              {query && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {!autocomplete && (
            <button
              onClick={onSearch}
              disabled={loading || !query.trim()}
              className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors duration-200"
              aria-label="Lancer la recherche"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span>Rechercher</span>
            </button>
          )}
        </div>
      );
    }
  )
);

SearchInput.displayName = "SearchInput";
