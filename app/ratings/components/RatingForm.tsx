'use client';

import { useState } from 'react';
import { Sight, Traveler } from '../types';

interface RatingFormProps {
    sight: Sight;
    travelers: Traveler[];
    currentUserId: number;
    onSave: (userId: number, sightId: number, score: number) => Promise<void>;
    onClose: () => void;
}

export default function RatingForm({ sight, travelers, currentUserId, onSave, onClose }: RatingFormProps) {
    const [selectedUserId, setSelectedUserId] = useState<number>(currentUserId);
    const [selectedScore, setSelectedScore] = useState<number>(0);
    const [hoveredScore, setHoveredScore] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedUserId) {
            alert('Pasirinkite vartotoją');
            return;
        }
        
        if (selectedScore === 0) {
            alert('Pasirinkite įvertinimą');
            return;
        }
        
        setSubmitting(true);
        try {
            await onSave(selectedUserId, sight.Id, selectedScore);
            onClose();
        } catch (error) {
            console.error('Klaida:', error);
            alert('Klaida išsaugant įvertinimą');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Įvertinti vietą</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="mb-4">
                        <h3 className="font-semibold">{sight.Name}</h3>
                        <p className="text-sm text-gray-600">{sight.City}</p>
                        <p className="text-sm text-gray-500 mt-2">{sight.Description}</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Keliautojas:
                            </label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {travelers.map((traveler) => (
                                    <option key={traveler.Id} value={traveler.Id}>
                                        {traveler.Username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Įvertinimas:
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                        key={score}
                                        type="button"
                                        onClick={() => setSelectedScore(score)}
                                        onMouseEnter={() => setHoveredScore(score)}
                                        onMouseLeave={() => setHoveredScore(0)}
                                        className="text-3xl focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <span className={
                                            (hoveredScore >= score || selectedScore >= score)
                                                ? 'text-yellow-500'
                                                : 'text-gray-300'
                                        }>
                                            ★
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {selectedScore > 0 && `Pasirinktas įvertinimas: ${selectedScore} žvaigždutės`}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 transition"
                            >
                                Atšaukti
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {submitting ? 'Išsaugoma...' : 'Išsaugoti'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}