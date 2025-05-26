// Types pour l'API d'adresse française
export interface AddressProperties {
  label: string;
  score: number;
  housenumber?: string;
  id: string;
  name: string;
  postcode: string;
  citycode: string;
  x: number;
  y: number;
  city: string;
  context: string;
  type: string;
  importance: number;
  street?: string;
  district?: string; // Ajout du champ district pour les entreprises
}

export interface AddressGeometry {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Address {
  type: "Feature";
  geometry: AddressGeometry;
  properties: AddressProperties;
}

export interface APIResponse {
  type: "FeatureCollection";
  version: string;
  features: Address[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
}

export interface SearchState {
  query: string;
  results: Address[];
  loading: boolean;
  error: string;
  showResults: boolean;
  selectedAddress: Address | null;
  limit: number;
  autocomplete: boolean;
}

export interface SearchHistory {
  id: string;
  query: string;
  address: Address;
  timestamp: number;
}

export interface FavoriteAddress {
  id: string;
  address: Address;
  nickname?: string;
  timestamp: number;
}

export interface SearchConfig {
  debounceMs: number;
  minQueryLength: number;
  defaultLimit: number;
  enableGeolocation: boolean;
  enableHistory: boolean;
  enableFavorites: boolean;
}
