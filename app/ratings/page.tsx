'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sight, Traveler, SaveRatingRequest } from './types';
import RatingForm from './components/RatingForm';

export default function RatingsPage() {
    const searchParams = useSearchParams();
    const tripId = searchParams.get('tripId') ? parseInt(searchParams.get('tripId')!) : 1;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [selectedSight, setSelectedSight] = useState<Sight | null>(null);
    const [sights, setSights] = useState<Sight[]>([]);
    const [travelers, setTravelers] = useState<Traveler[]>([]);
    const [sightRatings, setSightRatings] = useState<Map<number, number>>(new Map());
    
    const currentUserId = 1;

    useEffect(() => {
        if (tripId) {
            loadData();
        }
    }, [tripId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("=== KRAUNU DUOMENIS ===");
            console.log("Trip ID:", tripId);
            
            // 1. Gauname kelionės lankytinas vietas
            const sightsResponse = await fetch(`http://localhost:5011/Trip/${tripId}/sights`);
            if (!sightsResponse.ok) {
                throw new Error(`HTTP error! status: ${sightsResponse.status}`);
            }
            const sightsData = await sightsResponse.json();
            console.log("Gautos vietos:", sightsData);
            setSights(Array.isArray(sightsData) ? sightsData : []);
            
            // 2. Gauname kelionės keliautojus
            const travelersResponse = await fetch(`http://localhost:5011/Trip/${tripId}/travelers`);
            if (!travelersResponse.ok) {
                throw new Error(`HTTP error! status: ${travelersResponse.status}`);
            }
            const travelersData = await travelersResponse.json();
            console.log("Gauti keliautojai:", travelersData);
            setTravelers(Array.isArray(travelersData) ? travelersData : []);
            
            // 3. Gauname įvertinimų averages
            if (travelersData?.length > 0 && sightsData?.length > 0) {
                const travelerIds = travelersData.map((t: Traveler) => t.Id);
                const sightIds = sightsData.map((s: Sight) => s.Id);
                
                const ratingsResponse = await fetch(`http://localhost:5011/Rating/get-ratings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sightIds: sightIds,
                        travelerIds: travelerIds
                    }),
                });
                
                if (ratingsResponse.ok) {
                    const ratingsData = await ratingsResponse.json();
                    setSightRatings(new Map(Object.entries(ratingsData || {}).map(([key, value]) => [Number(key), value as number])));
                }
            }
            
        } catch (error) {
            console.error('Klaida kraunant duomenis:', error);
            setError(error instanceof Error ? error.message : 'Nepavyko užkrauti duomenų');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenRatingForm = (sight: Sight) => {
        setSelectedSight(sight);
        setShowRatingForm(true);
    };

    const handleCloseRatingForm = () => {
        setShowRatingForm(false);
        setSelectedSight(null);
    };

    const handleSaveRating = async (userId: number, sightId: number, score: number) => {
        try {
            const saveData: SaveRatingRequest = {
                userId: userId,
                sightId: sightId,
                score: score
            };

            const response = await fetch(`http://localhost:5011/Rating/save-ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });

            if (response.ok) {
                alert('Įvertinimas sėkmingai išsaugotas!');
                await loadData();
                handleCloseRatingForm();
            } else {
                const error = await response.json();
                alert(error.message || 'Klaida išsaugant įvertinimą');
            }
        } catch (error) {
            console.error('Klaida išsaugant:', error);
            alert('Klaida išsaugant įvertinimą');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="p-4 text-center">Kraunama...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="p-4 text-center text-red-500">
                    Klaida: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Kelionės lankytinos vietos</h1>
            
            {/* Debug informacija */}
            <div className="bg-gray-100 p-3 mb-4 rounded text-sm">
                <p><strong>Debug info:</strong></p>
                <p>Kelionės ID: {tripId}</p>
                <p>Rasta lankytinų vietų: {sights.length}</p>
                <p>Rasta keliautojų: {travelers.length}</p>
            </div>
            
            {sights.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center text-yellow-700">
                    Šioje kelionėje nėra lankytinų vietų. Pridėkite vietų per duomenų bazę.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kairėje pusėje - vietos sąrašas */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4 border-b">
                                <h2 className="text-xl font-semibold">Lankytinos vietos</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Keliautojų skaičius: {travelers.length}
                                </p>
                            </div>
                            <div className="divide-y">
                                {sights.map((sight, index) => (
                                    <div key={sight?.Id || index} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{sight?.Name || "Be pavadinimo"}</h3>
                                                <p className="text-sm text-gray-600">{sight?.City || ""}</p>
                                                <p className="text-sm text-gray-500 mt-1">{sight?.Description || ""}</p>
                                                {sight?.PhotoUrl && (
                                                    <img 
                                                        src={sight.PhotoUrl} 
                                                        alt={sight.Name}
                                                        className="mt-2 w-full max-w-xs h-32 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="text-2xl font-bold text-yellow-500">
                                                    {sightRatings.get(sight?.Id)?.toFixed(1) || '0.0'}
                                                </div>
                                                <div className="text-xs text-gray-500">Vidurkis</div>
                                                <button
                                                    onClick={() => handleOpenRatingForm(sight)}
                                                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                                                >
                                                    Įvertinti
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dešinėje pusėje - keliautojų sąrašas */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4 border-b">
                                <h2 className="text-xl font-semibold">Keliautojai</h2>
                            </div>
                            <div className="divide-y">
                                {travelers.length === 0 ? (
                                    <div className="p-3 text-center text-gray-500">
                                        Nėra keliautojų
                                    </div>
                                ) : (
                                    travelers.map((traveler, index) => (
                                        <div key={traveler?.Id || index} className="p-3 hover:bg-gray-50">
                                            <p className="font-medium">{traveler?.Username || "Nežinomas"}</p>
                                            <p className="text-sm text-gray-500">{traveler?.Mail || ""}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Vertinimo forma */}
            {showRatingForm && selectedSight && (
                <RatingForm
                    sight={selectedSight}
                    travelers={travelers}
                    currentUserId={currentUserId}
                    onSave={handleSaveRating}
                    onClose={handleCloseRatingForm}
                />
            )}
        </div>
    );
}