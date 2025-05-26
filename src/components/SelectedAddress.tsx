import { memo, useState } from "react";
import {
  MapPin,
  Copy,
  ExternalLink,
  Star,
  StarOff,
  CheckCircle,
} from "lucide-react";
import type { Address } from "../types/address";

interface SelectedAddressProps {
  address: Address;
  onToggleFavorite?: (address: Address) => void;
  isFavorite?: (address: Address) => boolean;
}

export const SelectedAddress = memo(
  ({ address, onToggleFavorite, isFavorite }: SelectedAddressProps) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = async (text: string, field: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (err) {
        console.error("Erreur lors de la copie:", err);
      }
    };

    const openInMaps = () => {
      const [lng, lat] = address.geometry.coordinates;
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(mapsUrl, "_blank");
    };

    const formatCoordinates = () => {
      const [lng, lat] = address.geometry.coordinates;
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in-0 duration-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-green-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Adresse sélectionnée
          </h3>

          <div className="flex items-center space-x-2">
            {onToggleFavorite && isFavorite && (
              <button
                onClick={() => onToggleFavorite(address)}
                className="p-1 hover:bg-green-100 rounded transition-colors duration-150"
                title={
                  isFavorite(address)
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
                }
                aria-label={
                  isFavorite(address)
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
                }
              >
                {isFavorite(address) ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="h-4 w-4 text-gray-600" />
                )}
              </button>
            )}

            <button
              onClick={openInMaps}
              className="p-1 hover:bg-green-100 rounded transition-colors duration-150"
              title="Ouvrir dans Google Maps"
              aria-label="Ouvrir dans Google Maps"
            >
              <ExternalLink className="h-4 w-4 text-green-700" />
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Adresse:</span>{" "}
              {address.properties.label}
            </div>
            <button
              onClick={() =>
                copyToClipboard(address.properties.label, "address")
              }
              className="p-1 hover:bg-green-100 rounded transition-colors duration-150"
              title="Copier l'adresse"
              aria-label="Copier l'adresse"
            >
              {copiedField === "address" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Coordonnées:</span>{" "}
              {formatCoordinates()}
            </div>
            <button
              onClick={() =>
                copyToClipboard(formatCoordinates(), "coordinates")
              }
              className="p-1 hover:bg-green-100 rounded transition-colors duration-150"
              title="Copier les coordonnées"
              aria-label="Copier les coordonnées"
            >
              {copiedField === "coordinates" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          {address.properties.postcode && (
            <div>
              <span className="font-medium">Code postal:</span>{" "}
              {address.properties.postcode}
            </div>
          )}

          {address.properties.city && (
            <div>
              <span className="font-medium">Ville:</span>{" "}
              {address.properties.city}
            </div>
          )}

          <div>
            <span className="font-medium">Précision:</span>{" "}
            {(address.properties.score * 100).toFixed(1)}%
          </div>

          <div>
            <span className="font-medium">Type:</span> {address.properties.type}
          </div>
        </div>
      </div>
    );
  }
);

SelectedAddress.displayName = "SelectedAddress";
