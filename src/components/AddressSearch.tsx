import { useRef } from "react";
import { Loader2, MapPin, History, Star, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Hooks personnalisés
import { useAddressSearch } from "../hooks/useAddressSearch";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSearchHistory, useFavorites } from "../hooks/useSearchStorage";

// Composants modulaires
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { SelectedAddress } from "./SelectedAddress";
import { AddressMap } from "./AddressMap";
import { AppStats } from "./AppStats";

// Types
import type { Address } from "../types/address";

const AddressSearch = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hooks personnalisés
  const {
    query,
    results,
    loading,
    error,
    showResults,
    selectedAddress,
    limit,
    autocomplete,
    searchAddresses,
    selectAddress,
    clearSearch,
    setQuery,
    setLimit,
    setAutocomplete,
  } = useAddressSearch({
    debounceMs: 300,
    minQueryLength: 3,
    enableGeolocation: true,
  });

  const {
    loading: geoLoading,
    error: geoError,
    coordinates,
    getCurrentPosition,
    clearError: clearGeoError,
  } = useGeolocation();

  const { history, addToHistory } = useSearchHistory();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } =
    useFavorites();

  // Gérer la sélection d'adresse avec historique
  const handleSelectAddress = (address: Address) => {
    selectAddress(address);
    addToHistory(query, address);
    searchInputRef.current?.focus();
  };

  // Gérer la géolocalisation
  const handleGeolocation = async () => {
    clearGeoError();
    getCurrentPosition();

    if (coordinates) {
      // Recherche inversée avec les coordonnées
      const reverseQuery = `${coordinates.latitude},${coordinates.longitude}`;
      setQuery("Position actuelle");
      await searchAddresses(reverseQuery, limit);
    }
  };

  // Toggle favoris
  const handleToggleFavorite = (address: Address) => {
    if (isFavorite(address)) {
      const favoriteItem = favorites.find(
        (fav) => fav.address.properties.id === address.properties.id
      );
      if (favoriteItem) {
        removeFromFavorites(favoriteItem.id);
      }
    } else {
      addToFavorites(address);
    }
  };

  // Effacer la recherche avec focus
  const handleClearSearch = () => {
    clearSearch();
    searchInputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Recherche d'Adresses
        </h1>
        <p className="text-gray-600">
          Trouvez et géolocalisez des adresses en France
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h3 className="font-medium text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Options de recherche
        </h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autocomplete}
              onChange={(e) => setAutocomplete(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Recherche automatique</span>
          </label>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Limite:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interface de recherche */}
      <div className="relative">
        <SearchInput
          ref={searchInputRef}
          query={query}
          onQueryChange={setQuery}
          onSearch={() => searchAddresses(query, limit)}
          onClear={handleClearSearch}
          loading={loading}
          autocomplete={autocomplete}
          onGeolocationClick={handleGeolocation}
          geolocationLoading={geoLoading}
        />
      </div>

      {/* Erreurs */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {geoError && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertDescription className="text-orange-700">
            {geoError}
          </AlertDescription>
        </Alert>
      )}

      {/* Indicateur de chargement */}
      {loading && autocomplete && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Recherche en cours...</span>
        </div>
      )}

      {/* Résultats de recherche */}
      <SearchResults
        results={results}
        onSelectAddress={handleSelectAddress}
        loading={loading}
        visible={showResults}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />

      {/* Aucun résultat */}
      {showResults && results.length === 0 && !loading && query.length >= 3 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune adresse trouvée pour "{query}"</p>
          <p className="text-sm mt-1">Essayez avec des termes différents</p>
        </div>
      )}

      {/* Adresse sélectionnée */}
      {selectedAddress && (
        <SelectedAddress
          address={selectedAddress}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {/* Carte interactive */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Carte interactive
        </h3>
        <AddressMap
          selectedAddress={selectedAddress}
          userLocation={
            coordinates
              ? {
                  lat: coordinates.latitude,
                  lng: coordinates.longitude,
                }
              : null
          }
          height="400px"
          className="rounded-lg overflow-hidden"
        />
      </div>

      {/* Statistiques de l'application */}
      <AppStats
        searchCount={history.length}
        favoriteCount={favorites.length}
        lastSearchTime={
          history.length > 0 ? new Date(history[0].timestamp) : undefined
        }
        selectedAddress={
          selectedAddress
            ? {
                city: selectedAddress.properties.city,
                postcode: selectedAddress.properties.postcode,
              }
            : null
        }
      />

      {/* Historique et Favoris */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Historique récent */}
        {history.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center">
              <History className="h-5 w-5 mr-2" />
              Recherches récentes
            </h3>
            <div className="space-y-2">
              {history.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectAddress(item.address)}
                  className="w-full text-left p-2 hover:bg-blue-100 rounded text-sm transition-colors duration-150"
                >
                  <div className="font-medium text-blue-900 truncate">
                    {item.address.properties.label}
                  </div>
                  <div className="text-blue-700 text-xs">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favoris */}
        {favorites.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-3 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Adresses favorites
            </h3>
            <div className="space-y-2">
              {favorites.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectAddress(item.address)}
                  className="w-full text-left p-2 hover:bg-yellow-100 rounded text-sm transition-colors duration-150"
                >
                  <div className="font-medium text-yellow-900 truncate">
                    {item.nickname || item.address.properties.label}
                  </div>
                  {item.nickname && (
                    <div className="text-yellow-700 text-xs truncate">
                      {item.address.properties.label}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">
          💡 Conseils de recherche
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Tapez au moins 3 caractères pour démarrer la recherche</li>
          <li>• Utilisez le bouton géolocalisation pour votre position</li>
          <li>• Ajoutez des adresses en favoris avec l'étoile</li>
          <li>• Copiez les coordonnées d'un simple clic</li>
          <li>• Exemple: "20 avenue de Ségur, 75007 Paris"</li>
        </ul>
      </div>
    </div>
  );
};

export default AddressSearch;
