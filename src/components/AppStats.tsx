import React from "react";
import { BarChart3, MapPin, Clock, Star } from "lucide-react";

interface AppStatsProps {
  searchCount: number;
  favoriteCount: number;
  lastSearchTime?: Date;
  selectedAddress?: { city: string; postcode: string } | null;
}

export const AppStats: React.FC<AppStatsProps> = ({
  searchCount,
  favoriteCount,
  lastSearchTime,
  selectedAddress,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-3 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2" />
        Statistiques de session
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Nombre de recherches */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{searchCount}</div>
          <div className="text-xs text-blue-700">Recherches</div>
        </div>

        {/* Favoris */}
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {favoriteCount}
          </div>
          <div className="text-xs text-yellow-700 flex items-center justify-center">
            <Star className="h-3 w-3 mr-1" />
            Favoris
          </div>
        </div>

        {/* Dernière recherche */}
        <div className="text-center">
          <div className="text-xs text-green-600 flex items-center justify-center mb-1">
            <Clock className="h-3 w-3 mr-1" />
            Dernière recherche
          </div>
          <div className="text-sm font-medium text-green-700">
            {lastSearchTime
              ? lastSearchTime.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </div>
        </div>

        {/* Localisation actuelle */}
        <div className="text-center">
          <div className="text-xs text-purple-600 flex items-center justify-center mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            Sélectionnée
          </div>
          <div className="text-sm font-medium text-purple-700">
            {selectedAddress ? `${selectedAddress.postcode}` : "Aucune"}
          </div>
        </div>
      </div>

      {/* Barre de progression pour les favoris */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Favoris collectés</span>
          <span>{favoriteCount}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((favoriteCount / 10) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
