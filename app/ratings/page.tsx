'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RatingsForm from './components/RatingsForm';
import { SightRatingDto, TripRatingsResponseDto, SaveRatingDto } from './types';

export default function TripRatingsPage() {
    const params = useParams();
    const tripId = params.tripId as string;
    const userId = 1; // Pakeisti pagal prisijungusį vartotoją

    const [ratingsData, setRatingsData] = useState<TripRatingsResponseDto | null>(null);
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Gauti įvertinimų duomenis
    const fetchRatings = async () => {
        try {
            const response = await fetch(`http://localhost:5011/Ratings/trip/${tripId}/ratings/form?userId=${userId}`);
            const data = await response.json();
            setRatingsData(data);
        } catch (error) {
            console.error('Klaida gaunant duomenis:', error);
        } finally {
            setLoading(false);
        }
    };

    // Išsaugoti įvertinimus
    const handleSaveRatings = async (scores: Record<number, number>) => {
        const saveData: SaveRatingDto[] = Object.entries(scores).map(([sightId, score]) => ({
            sightId: Number(sightId),
            score: score
        }));

        try {
            const response = await fetch(`http://localhost:5011/Ratings/trip/${tripId}/save?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setRatingsData(updatedData);
                setShowRatingForm(false);
                alert('Įvertinimai sėkmingai išsaugoti!');
            }
        } catch (error) {
            console.error('Klaida išsaugant:', error);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [tripId]);

    if (loading) return <div className="p-4 text-center">Kraunama...</div>;

    if (!ratingsData || ratingsData.sights.length === 0) {
        return <div className="p-4 text-center">Šioje kelionėje nėra lankytinų vietų.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Kelionės įvertinimai</h1>
                    <p className="text-muted-foreground mt-1">
                        Bendras vidurkis: ⭐ {ratingsData.overallAverage}
                    </p>
                </div>
                {!showRatingForm && (
                    <button
                        onClick={() => setShowRatingForm(true)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        + Pridėti įvertinimą
                    </button>
                )}
            </div>

            <RatingsForm
                sights={ratingsData.sights}
                showForm={showRatingForm}
                onSave={handleSaveRatings}
                onCancel={() => setShowRatingForm(false)}
            />
        </div>
    );
}