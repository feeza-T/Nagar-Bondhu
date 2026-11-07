
import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

// Default location: Dhaka, Bangladesh
const DEFAULT_POSITION = [23.8103, 90.4125];

// Fix Leaflet's default marker icon paths in Vite
const markerIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Handles map clicks and marker movement
function LocationMarker({ position, onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend(event) {
          const marker = event.target;
          const newPosition = marker.getLatLng();

          onLocationSelect([
            newPosition.lat,
            newPosition.lng,
          ]);
        },
      }}
    />
  );
}

// Moves the map when the selected position changes
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 16, {
      duration: 0.8,
    });
  }, [map, position]);

  return null;
}

export default function LocationPicker({
  initialPosition = DEFAULT_POSITION,
  onLocationSelect,
  searchQuery = '',
}) {
  const [position, setPosition] = useState(initialPosition);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');

  const lastRequestTime = useRef(0);

  function handleLocationSelect(newPosition) {
    setPosition(newPosition);

    onLocationSelect?.({
      latitude: newPosition[0],
      longitude: newPosition[1],
    });
  }

  // Search for an address using OpenStreetMap Nominatim
  async function handleSearch() {
    const query = searchQuery.trim();

    if (!query) {
      setSearchError('Please enter an address in the location field first.');
      return;
    }

    // Respect the public Nominatim rate limit.
    const now = Date.now();

    if (now - lastRequestTime.current < 1100) {
      setSearchError('Please wait a moment before searching again.');
      return;
    }

    lastRequestTime.current = now;

    setSearching(true);
    setSearchError('');
    setSearchResults([]);
    setSelectedAddress('');

    try {
      const params = new URLSearchParams({
        q: query.includes('Bangladesh')
          ? query
          : `${query}, Bangladesh`,
        format: 'jsonv2',
        limit: '5',
        countrycodes: 'bd',
        addressdetails: '1',
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Location search failed. Please try again.');
      }

      const results = await response.json();

      if (!results.length) {
        setSearchError(
          'No matching location found. Try a more specific address.'
        );
        return;
      }

      setSearchResults(results);
    } catch (error) {
      setSearchError(
        error.message || 'Unable to search for this location.'
      );
    } finally {
      setSearching(false);
    }
  }

  // Select a search result and move the map
  function handleResultSelect(result) {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setSearchError('Invalid location coordinates.');
      return;
    }

    handleLocationSelect([latitude, longitude]);

    setSelectedAddress(result.display_name);
    setSearchResults([]);
    setSearchError('');
  }

  // Get the user's current GPS location
  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        handleLocationSelect([
          location.coords.latitude,
          location.coords.longitude,
        ]);

        setSelectedAddress('Your current location');
        setSearchResults([]);
      },
      () => {
        alert(
          'Unable to get your location. Please allow location access or select it manually on the map.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  return (
    <div className="w-full space-y-3">

      {/* Address search */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-forest">
          Find Your Location on the Map
        </h3>

        <p className="text-xs text-gray-500">
          Enter an address in the Location field above, then click
          Find on Map.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="btn btn-sm btn-primary"
          >
            {searching ? 'Searching...' : 'Find on Map'}
          </button>

          <button
            type="button"
            onClick={handleCurrentLocation}
            className="btn btn-sm btn-outline"
          >
            Use My Location
          </button>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm">
            <p className="border-b border-ink/10 px-3 py-2 text-xs font-semibold text-forest">
              Select the correct location
            </p>

            {searchResults.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleResultSelect(result)}
                className="flex w-full items-start gap-2 border-b border-ink/5 px-3 py-3 text-left text-sm transition last:border-b-0 hover:bg-mint2"
              >
                <span className="mt-0.5 text-forest">
                  <MapPinIcon />
                </span>

                <span className="text-gray-700">
                  {result.display_name}
                </span>
              </button>
            ))}
          </div>
        )}

        {searchError && (
          <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
            {searchError}
          </p>
        )}

        {selectedAddress && (
          <div className="rounded-lg bg-mint2 p-3 text-xs text-forest">
            <p className="font-semibold">Selected address</p>
            <p className="mt-1">{selectedAddress}</p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-ink/10">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          className="h-[350px] w-full"
          style={{ minHeight: '350px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker
            position={position}
            onLocationSelect={handleLocationSelect}
          />

          <MapUpdater position={position} />
        </MapContainer>
      </div>

      {/* Coordinates */}
      <div className="rounded-xl bg-mint2 p-3 text-xs text-forest">
        <p className="font-semibold">Selected coordinates</p>

        <p className="mt-1">
          Latitude: {position[0].toFixed(6)}
        </p>

        <p>
          Longitude: {position[1].toFixed(6)}
        </p>
      </div>

      <p className="text-xs text-gray-500">
        You can drag the marker or click the map to fine-tune
        the exact waste location.
      </p>

      <p className="text-xs text-gray-500">
        Map data © OpenStreetMap contributors.
      </p>
    </div>
  );
}

// Small location icon without adding another dependency
function MapPinIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
