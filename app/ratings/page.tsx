'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Sight {
    Id: number;
    Name: string;
    City: string;
    Description: string;
}

export default function RatingsPage() {
    const searchParams = useSearchParams();
    const tripId = searchParams.get('tripId');
    const [sights, setSights] = useState<Sight[]>([]);
    const [averages, setAverages] = useState<Record<number, number>>({});
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [showStars, setShowStars] = useState(false);
    const userId = 1;

    useEffect(() => {
        if (tripId) loadData();
    }, [tripId]);

    const loadData = async () => {
        try {
            const sightsRes = await fetch(`http://localhost:5011/Trip/${tripId}/sights`);
            const sightsData = await sightsRes.json();
            setSights(sightsData);

            const travelersRes = await fetch(`http://localhost:5011/Trip/${tripId}/travelers`);
            const travelersData = await travelersRes.json();
            const travelerIds = travelersData.map((t: any) => t.id);
            const sightIds = sightsData.map((s: Sight) => s.Id);

            const ratingsRes = await fetch(`http://localhost:5011/Rating/getRatings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sightIds, travelerIds })
            });
            
            const text = await ratingsRes.text();
            if (text) {
                try {
                    const ratingsData = JSON.parse(text);
                    setAverages(ratingsData);
                } catch (e) {
                    setAverages({});
                }
            } else {
                setAverages({});
            }
        } catch (error) {
            console.error('Error loading data:', error);
            setAverages({});
        }
    };

    const handleRatingChange = (sightId: number, score: number) => {
        setRatings(prev => ({ ...prev, [sightId]: score }));
    };

    const handleSaveAll = async () => {
        for (const [sightId, score] of Object.entries(ratings)) {
            await fetch(`http://localhost:5011/Rating/saveRatings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, sightId: parseInt(sightId), score })
            });
        }
        alert('All ratings saved!');
        setShowStars(false);
        loadData();
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Rate Trip</h1>
            
            {sights.map((sight) => (
                <div key={sight.Id} className="border p-4 my-2 rounded">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold">{sight.Name}</h3>
                            <p className="text-gray-600">{sight.City}</p>
                            <p className="text-sm text-gray-500">{sight.Description}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Average</div>
                            <div className="text-2xl font-bold text-yellow-500">
                                {averages[sight.Id] ? averages[sight.Id].toFixed(1) : '?'}
                            </div>
                        </div>
                    </div>
                    
                    {showStars && (
                        <div className="mt-3 pt-3 border-t">
                            <div className="text-sm font-medium mb-2">Your rating:</div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                        key={score}
                                        onClick={() => handleRatingChange(sight.Id, score)}
                                        className="text-3xl focus:outline-none hover:scale-110 transition"
                                    >
                                        <span className={ratings[sight.Id] >= score ? 'text-yellow-500' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            
            {!showStars ? (
                <button
                    onClick={() => setShowStars(true)}
                    className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600"
                >
                    Rate all sights
                </button>
            ) : (
                <button
                    onClick={handleSaveAll}
                    className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600"
                >
                    Save all ratings
                </button>
            )}
        </div>
    );
}