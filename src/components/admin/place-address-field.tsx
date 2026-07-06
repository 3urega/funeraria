"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PlaceLocationInput } from "@/lib/geo/types";

type Props = {
  value: PlaceLocationInput;
  onChange: (value: PlaceLocationInput) => void;
  showCity?: boolean;
};

type Suggestion = { placeId: string; label: string };

export function PlaceAddressField({ value, onChange, showCity = false }: Props) {
  const listId = useId();
  const sessionTokenRef = useRef(crypto.randomUUID());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState(value.address);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [geoConfigured, setGeoConfigured] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(!value.googlePlaceId && Boolean(value.address));

  useEffect(() => {
    setQuery(value.address);
  }, [value.address]);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    setGeoError(null);

    const params = new URLSearchParams({
      input,
      sessionToken: sessionTokenRef.current,
    });

    const res = await fetch(`/api/admin/places/autocomplete?${params}`);
    if (res.status === 503) {
      setGeoConfigured(false);
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    if (!res.ok) {
      setGeoError("Error en cercar adreces.");
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    const data = await res.json();
    setSuggestions(data.suggestions ?? []);
    setLoadingSuggestions(false);
  }, []);

  function onQueryChange(next: string) {
    setQuery(next);
    setManualMode(true);
    onChange({ ...value, address: next });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(next), 300);
  }

  async function selectSuggestion(suggestion: Suggestion) {
    setSuggestions([]);
    setQuery(suggestion.label);
    setLoadingDetails(true);
    setGeoError(null);
    setManualMode(false);

    const params = new URLSearchParams({ placeId: suggestion.placeId });
    const res = await fetch(`/api/admin/places/details?${params}`);

    if (!res.ok) {
      setGeoError("No s'ha pogut obtenir la ubicació.");
      setLoadingDetails(false);
      sessionTokenRef.current = crypto.randomUUID();
      return;
    }

    const data = await res.json();
    const place = data.place as {
      formattedAddress: string;
      city: string;
      latitude: number;
      longitude: number;
      googleMapsUrl: string;
      googlePlaceId: string;
    };

    onChange({
      address: place.formattedAddress,
      city: showCity ? place.city : value.city,
      googleMapsUrl: place.googleMapsUrl,
      latitude: place.latitude,
      longitude: place.longitude,
      googlePlaceId: place.googlePlaceId,
    });

    setQuery(place.formattedAddress);
    setLoadingDetails(false);
    sessionTokenRef.current = crypto.randomUUID();
  }

  function resetSearch() {
    sessionTokenRef.current = crypto.randomUUID();
    setQuery("");
    setSuggestions([]);
    setManualMode(false);
    onChange({
      address: "",
      city: showCity ? "" : value.city,
      googleMapsUrl: "",
      latitude: null,
      longitude: null,
      googlePlaceId: "",
    });
  }

  const hasCoords = value.latitude != null && value.longitude != null;

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Ubicació</p>
        {(value.address || hasCoords) && (
          <button
            type="button"
            onClick={resetSearch}
            className="text-xs text-zinc-500 hover:text-zinc-800"
          >
            Cercar de nou
          </button>
        )}
      </div>

      {!geoConfigured && (
        <p className="text-xs text-amber-800">
          Geolocalització no disponible (falta GOOGLE_MAPS_API_KEY). Pots omplir
          l&apos;adreça i l&apos;enllaç de Maps manualment.
        </p>
      )}

      <div className="relative">
        <label htmlFor={`${listId}-address`} className="mb-1 block text-sm font-medium">
          Adreça
        </label>
        <input
          id={`${listId}-address`}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2"
          placeholder="Escriu per cercar (mín. 3 caràcters)…"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={`${listId}-suggestions`}
        />
        {(loadingSuggestions || loadingDetails) && (
          <p className="mt-1 text-xs text-zinc-500">Cercant…</p>
        )}
        {suggestions.length > 0 && (
          <ul
            id={`${listId}-suggestions`}
            className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-zinc-200 bg-white shadow-md"
          >
            {suggestions.map((s) => (
              <li key={s.placeId}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50"
                  onClick={() => selectSuggestion(s)}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showCity && (
        <div>
          <label htmlFor={`${listId}-city`} className="mb-1 block text-sm font-medium">
            Ciutat
          </label>
          <input
            id={`${listId}-city`}
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2"
          />
        </div>
      )}

      <div>
        <label htmlFor={`${listId}-maps`} className="mb-1 block text-sm font-medium">
          Google Maps (URL)
        </label>
        <input
          id={`${listId}-maps`}
          type="url"
          value={value.googleMapsUrl}
          onChange={(e) => onChange({ ...value, googleMapsUrl: e.target.value })}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2"
        />
      </div>

      {hasCoords && !manualMode && (
        <p className="text-xs text-green-700">
          Coordenades: {value.latitude!.toFixed(5)}, {value.longitude!.toFixed(5)}
        </p>
      )}

      {manualMode && value.address && !hasCoords && (
        <p className="text-xs text-amber-700">
          Adreça manual sense coordenades. Tria un resultat del cercador per
          geolocalitzar.
        </p>
      )}

      {value.googleMapsUrl && (
        <a
          href={value.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-blue-600 hover:underline"
        >
          Obrir a Google Maps →
        </a>
      )}

      {geoError && <p className="text-sm text-red-600">{geoError}</p>}
    </div>
  );
}
