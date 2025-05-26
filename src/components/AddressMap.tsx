import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Address } from "../types/address";
import { useNotification } from "../hooks/useNotification";

// Fix pour les icônes Leaflet avec Webpack/Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Icône personnalisée pour les adresses sélectionnées
const selectedAddressIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icône pour la position actuelle de l'utilisateur
const userLocationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icône pour les entreprises
const companyIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapControllerProps {
  address: Address | null;
  userLocation?: { lat: number; lng: number } | null;
  onMapReady?: (map: L.Map) => void;
}

// Composant pour contrôler la vue de la carte
const MapController: React.FC<MapControllerProps> = ({
  address,
  userLocation,
  onMapReady,
}) => {
  const map = useMap();

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useEffect(() => {
    if (address) {
      const [lng, lat] = address.geometry.coordinates;
      map.setView([lat, lng], 15);
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [address, userLocation, map]);

  return null;
};

interface AddressMapProps {
  selectedAddress: Address | null;
  addresses?: Address[]; // Liste de toutes les adresses à afficher
  userLocation?: { lat: number; lng: number } | null;
  height?: string;
  className?: string;
}

export const AddressMap: React.FC<AddressMapProps> = ({
  selectedAddress,
  addresses = [],
  userLocation,
  height = "400px",
  className = "",
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const { copyToClipboard } = useNotification();

  // Position par défaut (Paris)
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  const defaultZoom = 10;

  // Callback pour récupérer l'instance de la carte
  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
  };

  // Fonction pour copier les coordonnées avec notification
  const copyCoordinates = (lat: number, lng: number) => {
    const coordinates = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    copyToClipboard(coordinates, "Coordonnées copiées !");
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg border border-gray-300"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Contrôleur de la carte */}
        <MapController
          address={selectedAddress}
          userLocation={userLocation}
          onMapReady={handleMapReady}
        />

        {/* Marqueur pour l'adresse sélectionnée */}
        {selectedAddress && (
          <Marker
            position={[
              selectedAddress.geometry.coordinates[1],
              selectedAddress.geometry.coordinates[0],
            ]}
            icon={selectedAddressIcon}
          >
            <Popup>
              <div className="text-sm space-y-2">
                <div className="font-medium text-gray-900">
                  {selectedAddress.properties.label}
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  {selectedAddress.properties.housenumber && (
                    <div>N° {selectedAddress.properties.housenumber}</div>
                  )}
                  {selectedAddress.properties.street && (
                    <div>{selectedAddress.properties.street}</div>
                  )}
                  <div>
                    {selectedAddress.properties.postcode}{" "}
                    {selectedAddress.properties.city}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div>Type: {selectedAddress.properties.type}</div>
                    <div>
                      Score:{" "}
                      {(selectedAddress.properties.score * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Bouton pour copier les coordonnées */}
                <button
                  onClick={() =>
                    copyCoordinates(
                      selectedAddress.geometry.coordinates[1],
                      selectedAddress.geometry.coordinates[0]
                    )
                  }
                  className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  Copier les coordonnées
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marqueurs pour toutes les adresses (sauf celle sélectionnée) */}
        {addresses
          .filter(
            (address) =>
              address.properties.id !== selectedAddress?.properties.id
          )
          .map((address, index) => {
            const isCompany = address.properties.type === "company";
            const icon = isCompany ? companyIcon : undefined; // Utilise l'icône par défaut pour les adresses normales

            return (
              <Marker
                key={address.properties.id || index}
                position={[
                  address.geometry.coordinates[1],
                  address.geometry.coordinates[0],
                ]}
                icon={icon}
              >
                <Popup>
                  <div className="text-sm space-y-2">
                    <div className="font-medium text-gray-900">
                      {address.properties.name || address.properties.label}
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      {address.properties.street && (
                        <div>{address.properties.street}</div>
                      )}
                      <div>
                        {address.properties.postcode} {address.properties.city}
                      </div>
                      {isCompany && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div>🏢 Entreprise</div>
                          {address.properties.context && (
                            <div>{address.properties.context}</div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        copyCoordinates(
                          address.geometry.coordinates[1],
                          address.geometry.coordinates[0]
                        )
                      }
                      className="mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      Copier les coordonnées
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Marqueur pour la position de l'utilisateur */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-medium text-blue-900">Votre position</div>
                <div className="text-xs text-gray-600 mt-1">
                  Lat: {userLocation.lat.toFixed(6)}
                  <br />
                  Lng: {userLocation.lng.toFixed(6)}
                </div>
                <button
                  onClick={() =>
                    copyCoordinates(userLocation.lat, userLocation.lng)
                  }
                  className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  Copier les coordonnées
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Légende et contrôles */}
      <div className="absolute top-2 right-2 space-y-2">
        {/* Légende */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded shadow-lg text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Adresse sélectionnée</span>
            </div>
            {addresses.some((addr) => addr.properties.type === "company") && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Entreprises</span>
              </div>
            )}
            {addresses.some((addr) => addr.properties.type !== "company") && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Adresses</span>
              </div>
            )}
            {userLocation && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Votre position</span>
              </div>
            )}
          </div>
        </div>

        {/* Bouton pour recentrer sur la France */}
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView(defaultCenter, defaultZoom);
            }
          }}
          className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded shadow-lg hover:bg-opacity-100 transition-all duration-200"
          title="Recentrer sur la France"
        >
          🇫🇷
        </button>
      </div>

      {/* Instructions */}
      {!selectedAddress && !userLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="font-medium">Carte interactive</div>
            <div className="text-sm mt-1">
              Sélectionnez une adresse pour voir sa position
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressMap;
