import { memo, useState } from "react";
import { Grid, List } from "lucide-react";
import type { Address } from "../types/address";
import { AddressCard } from "./AddressCard";

interface SearchResultsProps {
  results: Address[];
  onSelectAddress: (address: Address) => void;
  loading: boolean;
  visible: boolean;
  onToggleFavorite?: (address: Address) => void;
  isFavorite?: (address: Address) => boolean;
}

export const SearchResults = memo(
  ({
    results,
    onSelectAddress,
    visible,
    onToggleFavorite,
    isFavorite,
  }: SearchResultsProps) => {
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

    if (!visible || results.length === 0) {
      return null;
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg animate-in fade-in-0 duration-200">
        {/* En-tête avec compteur et toggle de vue */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            {results.length} résultat{results.length > 1 ? "s" : ""} trouvé
            {results.length > 1 ? "s" : ""}
          </div>

          {/* Toggle vue liste/grille */}
          <div className="flex items-center space-x-1 bg-white rounded-md p-1 border">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors duration-200 ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Vue liste"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors duration-200 ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Vue grille"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contenu avec scroll */}
        <div className="max-h-96 overflow-y-auto">
          {viewMode === "grid" ? (
            // Vue grille
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {results.map((result, index) => (
                <AddressCard
                  key={result.properties.id || index}
                  address={result}
                  onSelect={onSelectAddress}
                  onToggleFavorite={onToggleFavorite || (() => {})}
                  isFavorite={isFavorite ? isFavorite(result) : false}
                />
              ))}
            </div>
          ) : (
            // Vue liste
            <div className="divide-y divide-gray-100">
              {results.map((result, index) => (
                <AddressCard
                  key={result.properties.id || index}
                  address={result}
                  onSelect={onSelectAddress}
                  onToggleFavorite={onToggleFavorite || (() => {})}
                  isFavorite={isFavorite ? isFavorite(result) : false}
                  className="border-0 rounded-none border-b border-gray-100 last:border-b-0"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SearchResults.displayName = "SearchResults";
