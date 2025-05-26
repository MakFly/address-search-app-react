/**
 * Utilitaire pour valider et normaliser les noms de villes
 */

// Liste des villes françaises supportées par notre application
export const supportedCities = [
  "paris",
  "marseille",
  "lyon",
  "toulouse",
  "nice",
  "nantes",
  "strasbourg",
  "montpellier",
  "bordeaux",
  "lille",
  "rennes",
  "reims",
  "le havre",
  "saint-etienne",
  "toulon",
  "angers",
  "grenoble",
  "dijon",
  "nimes",
  "aix-en-provence",
];

/**
 * Normalise un nom de ville (supprime les accents, met en minuscule)
 */
export function normalizeCity(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Vérifie si une ville est supportée par l'application
 */
export function isCitySupported(city: string): boolean {
  if (!city) return false;

  const normalizedCity = normalizeCity(city);
  console.log(
    `Validation de la ville: "${city}" (normalisée: "${normalizedCity}")`
  );

  // Recherche exacte - vérifier si la ville est exactement dans notre liste
  if (supportedCities.includes(normalizedCity)) {
    console.log(`✓ Ville "${city}" trouvée par correspondance exacte`);
    return true;
  }

  // Recherche exacte peu importe les espaces - pour "Paris" vs " paris "
  const trimmedCity = normalizedCity.replace(/\s+/g, "");
  for (const supportedCity of supportedCities) {
    const trimmedSupported = supportedCity.replace(/\s+/g, "");
    if (trimmedCity === trimmedSupported) {
      console.log(
        `✓ Ville "${city}" trouvée par correspondance exacte (sans espaces)`
      );
      return true;
    }
  }

  // Recherche partielle
  for (const supportedCity of supportedCities) {
    // Si la ville normalisée contient une ville supportée ou vice versa
    if (
      normalizedCity.includes(supportedCity) ||
      supportedCity.includes(normalizedCity)
    ) {
      console.log(
        `✓ Ville "${city}" trouvée par correspondance partielle avec "${supportedCity}"`
      );
      return true;
    }
  }

  console.log(
    `✗ Ville "${city}" non reconnue dans la liste: ${supportedCities.join(
      ", "
    )}`
  );
  return false;
}

/**
 * Suggère des villes similaires à celle recherchée
 */
export function getSimilarCities(
  city: string,
  maxSuggestions: number = 3
): string[] {
  if (!city) return [];

  const normalizedCity = normalizeCity(city);
  const suggestions: string[] = [];

  for (const supportedCity of supportedCities) {
    // Si la ville contient une partie du nom recherché ou vice versa
    if (
      normalizedCity.includes(supportedCity.substring(0, 2)) ||
      supportedCity.includes(normalizedCity.substring(0, 2))
    ) {
      suggestions.push(supportedCity);
    }

    if (suggestions.length >= maxSuggestions) break;
  }

  // Si aucune suggestion n'est trouvée, on renvoie quelques grandes villes
  if (suggestions.length === 0) {
    return ["paris", "lyon", "marseille"].slice(0, maxSuggestions);
  }

  return suggestions;
}

interface CityRecord {
  city: string;
  lat: number;
  lon: number;
}

const cityDatabase: CityRecord[] = [
  { city: "Paris", lat: 48.8566, lon: 2.3522 },
  { city: "Lyon", lat: 45.764, lon: 4.8357 },
  { city: "Marseille", lat: 43.2965, lon: 5.3698 },
  { city: "Lille", lat: 50.6292, lon: 3.0573 },
  { city: "Toulouse", lat: 43.6047, lon: 1.4442 },
  { city: "Bordeaux", lat: 44.8378, lon: -0.5792 },
  { city: "Nice", lat: 43.7102, lon: 7.262 },
  { city: "Nantes", lat: 47.2184, lon: -1.5536 },
  { city: "Strasbourg", lat: 48.5734, lon: 7.7521 },
  { city: "Montpellier", lat: 43.6108, lon: 3.8767 },
  { city: "Rennes", lat: 48.1173, lon: -1.6778 },
  { city: "Rouen", lat: 49.4432, lon: 1.0993 },
  { city: "Caen", lat: 49.1829, lon: -0.3707 },
  { city: "Le Havre", lat: 49.4944, lon: 0.1079 },
  { city: "Montivilliers", lat: 49.5458, lon: 0.1917 },
];

export const getCityCoordinates = (
  city: string
): { lat: number; lon: number } | undefined => {
  const normalizedCityToSearch = normalizeCity(city);
  const foundCity = cityDatabase.find(
    (dbCity: CityRecord) =>
      normalizeCity(dbCity.city) === normalizedCityToSearch
  );
  if (foundCity) {
    return { lat: foundCity.lat, lon: foundCity.lon };
  }
  console.warn(`Coordonnées non trouvées pour ${city}`);
  return undefined; // Retourner undefined si la ville n'est pas trouvée
};
