'use client';

import { useState, useEffect } from 'react';

// CORRECTED INTERFACE based on Production API
interface PudoTerminal {
  id?: number; // Sometimes missing in Prod
  code?: string; // e.g. "CG51"
  name: string;
  address: string;
  city?: string; // Missing in Prod
  detailed_address?: {
      city?: string;
      locality?: string;
      sublocality?: string; // e.g. "Walmer"
      postal_code?: string;
  };
  latitude: string;
  longitude: string;
  status: string;
}

interface LockerSelectorProps {
  onSelect: (locker: PudoTerminal) => void;
  selectedLockerId?: number | string; // Updated to accept string code
}

export default function LockerSelector({ onSelect, selectedLockerId }: LockerSelectorProps) {
  const [terminals, setTerminals] = useState<PudoTerminal[]>([]);
  const [filtered, setFiltered] = useState<PudoTerminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    async function loadLockers() {
      try {
        const res = await fetch('/api/pudo/lockers');
        if (!res.ok) throw new Error('Failed to load lockers');
        const data = await res.json();
        
        // Deduplicate based on Code or Name
        const unique = Array.from(new Map(data.map((item: any) => [item.code || item.name, item])).values()) as PudoTerminal[];

        setTerminals(unique);
        setFiltered(unique);
      } catch (err) {
        console.error(err);
        setError('Could not access PUDO Network. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadLockers();
  }, []);

  // Updated Filter Logic
  useEffect(() => {
    if (!search) {
        setFiltered(terminals);
        return;
    }
    const lower = search.toLowerCase();
    const hits = terminals.filter(t => {
        const nameMatch = (t.name || '').toLowerCase().includes(lower);
        const addressMatch = (t.address || '').toLowerCase().includes(lower);
        
        // Deep search into detailed address
        const subLocalityMatch = (t.detailed_address?.sublocality || '').toLowerCase().includes(lower);
        const localityMatch = (t.detailed_address?.locality || '').toLowerCase().includes(lower);
        const cityMatch = (t.city || '').toLowerCase().includes(lower);

        return nameMatch || addressMatch || subLocalityMatch || localityMatch || cityMatch;
    });
    setFiltered(hits);
  }, [search, terminals]);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    setLoading(true);
    
    try {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                const sorted = [...terminals].sort((a, b) => {
                    const distA = getDistanceFromLatLonInKm(latitude, longitude, parseFloat(a.latitude), parseFloat(a.longitude));
                    const distB = getDistanceFromLatLonInKm(latitude, longitude, parseFloat(b.latitude), parseFloat(b.longitude));
                    return distA - distB;
                });

                setTerminals(sorted);
                setFiltered(sorted.slice(0, 50)); 
                setSearch(''); 
                setLoading(false);
            },
            (err) => {
                console.error("Geo Error:", err);
                // FRIENDLY ERROR - No Console Crash
                alert('We could not access your location. Please check your browser permissions.');
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } catch (e) {
        console.error(e);
        setLoading(false);
    }
  };

  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }

  if (loading && terminals.length === 0) return <div className="p-4 bg-gray-100 text-center animate-pulse">📡 Connecting to PUDO Network...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-600">{error}</div>;

  return (
    <div className="border-4 border-black bg-white p-4 space-y-4">
        <h3 className="font-archivo uppercase text-xl border-b-2 border-black pb-2">Select Locker</h3>
        
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Search suburb (e.g. Walmer)" 
                className="flex-1 border-2 border-black p-2 font-mono"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button 
                type="button" 
                onClick={handleNearMe}
                className="bg-black text-[#facc15] px-4 font-bold uppercase hover:bg-gray-800"
            >
                📍 Near Me
            </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto border-2 border-gray-200 custom-scrollbar space-y-2">
            {filtered.slice(0, 100).map((t, index) => {
                // Use Code or ID or Index fallback
                const uniqueKey = t.code || t.id || `loc-${index}`;
                const isSelected = selectedLockerId === uniqueKey || selectedLockerId === t.id;
                
                return (
                    <button 
                        key={uniqueKey}
                        type="button" 
                        onClick={() => onSelect(t)}
                        className={`w-full text-left p-3 border-2 transition-all hover:bg-gray-50 flex justify-between items-center ${isSelected ? 'border-[#facc15] bg-black text-[#facc15]' : 'border-transparent border-b-gray-100'}`}
                    >
                        <div>
                            <div className="font-bold uppercase">{t.name}</div>
                            <div className="text-xs font-mono opacity-75">
                                {t.detailed_address?.sublocality || t.city || 'SA'}, {t.detailed_address?.locality || ''}
                            </div>
                        </div>
                        {userLocation && (
                            <div className="text-xs font-mono bg-[#facc15] text-black px-1">
                                {getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, parseFloat(t.latitude), parseFloat(t.longitude)).toFixed(1)} km
                            </div>
                        )}
                    </button>
                )
            })}
            {filtered.length === 0 && (
                <div className="p-4 text-center text-gray-500 font-mono">No lockers found. Try "Near Me" or a different suburb.</div>
            )}
        </div>
    </div>
  );
}
