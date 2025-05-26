import React from "react";
import { Copy, MapPin, Star } from "lucide-react";
import type { Address } from "../types/address";
import { useNotification } from "../hooks/useNotification";

interface AddressCardProps {
  address: Address;
  onSelect: (address: Address) => void;
  onToggleFavorite: (address: Address) => void;
  isFavorite: boolean;
  className?: string;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onSelect,
  onToggleFavorite,
  isFavorite,
  className = "",
}) => {
  const { copyToClipboard } = useNotification();
  const { properties, geometry } = address;

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(properties.label, "Adresse copiée !");
  };

  const handleCopyCoordinates = (e: React.MouseEvent) => {
    e.stopPropagation();
    const coords = `${geometry.coordinates[1].toFixed(
      6
    )}, ${geometry.coordinates[0].toFixed(6)}`;
    copyToClipboard(coords, "Coordonnées copiées !");
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(address);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "housenumber":
        return "bg-blue-100 text-blue-800";
      case "street":
        return "bg-green-100 text-green-800";
      case "locality":
        return "bg-yellow-100 text-yellow-800";
      case "municipality":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
      onClick={() => onSelect(address)}
    >
      {/* En-tête avec badge type et score */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
              properties.type
            )}`}
          >
            {properties.type}
          </span>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full mr-0.5 ${
                    i < Math.round(properties.score * 5)
                      ? "bg-yellow-400"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span>{(properties.score * 100).toFixed(0)}%</span>
          </div>
        </div>

        <button
          onClick={handleToggleFavorite}
          className={`p-1 rounded-full transition-colors duration-200 ${
            isFavorite
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-gray-400 hover:text-yellow-500"
          }`}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Adresse principale */}
      <div className="mb-3">
        <h3 className="font-medium text-gray-900 text-sm leading-relaxed">
          {properties.label}
        </h3>
      </div>

      {/* Détails additionnels */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        {properties.housenumber && (
          <div>
            <span className="font-medium">N°:</span> {properties.housenumber}
          </div>
        )}
        <div>
          <span className="font-medium">Code postal:</span>{" "}
          {properties.postcode}
        </div>
        <div>
          <span className="font-medium">Ville:</span> {properties.city}
        </div>
        <div>
          <span className="font-medium">Code INSEE:</span> {properties.citycode}
        </div>
      </div>

      {/* Coordonnées */}
      <div className="text-xs text-gray-500 mb-3">
        <span className="font-medium">Coordonnées:</span>{" "}
        {geometry.coordinates[1].toFixed(6)},{" "}
        {geometry.coordinates[0].toFixed(6)}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyAddress}
            className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <Copy className="h-3 w-3" />
            <span>Adresse</span>
          </button>
          <button
            onClick={handleCopyCoordinates}
            className="inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 transition-colors duration-200"
          >
            <MapPin className="h-3 w-3" />
            <span>Coordonnées</span>
          </button>
        </div>

        <div className="text-xs text-gray-400">Cliquez pour sélectionner</div>
      </div>
    </div>
  );
};
