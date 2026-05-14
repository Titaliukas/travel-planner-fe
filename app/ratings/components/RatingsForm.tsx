'use client';

import { useState, useEffect } from 'react';
import { SightRatingDto } from '../types';

interface RatingsFormProps {
    sights: SightRatingDto[];
    showForm: boolean;
    onSave: (scores: Record<number, number>) => void;
    onCancel: () => void;
}

export default function RatingsForm({ sights, showForm, onSave, onCancel }: RatingsFormProps) {
    const [scores, setScores] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Inicijuoti scores su esamais vartotojo įvertinimais
        const initialScores: Record<number, number> = {};
        sights.forEach(sight => {
            initialScores[sight.sightId] = sight.userScore || 1;
        });
        setScores(initialScores);
    }, [sights]);

    const handleScoreChange = (sightId: number, score: number) => {
        setScores(prev => ({ ...prev, [sightId]: score }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSave(scores);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                <h2 className="text-xl font-semibold">Lankytinos vietos</h2>
                {sights.map((sight) => (
                    <div key={sight.sightId} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold">{sight.sightName}</h3>
                                <p className="text-muted-foreground text-sm">{sight.city}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">{sight.averageScore}</div>
                                <div className="text-sm text-muted-foreground">
                                    ⭐ iš {sight.ratingCount} įvertinimų
                                </div>
                            </div>
                        </div>

                        {/* Rating form for this sight */}
                        {showForm && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Tavo įvertinimas:</span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((score) => (
                                            <button
                                                key={score}
                                                type="button"
                                                onClick={() => handleScoreChange(sight.sightId, score)}
                                                className={`w-10 h-10 rounded-full transition-colors text-lg ${
                                                    scores[sight.sightId] === score
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                }`}
                                            >
                                                {score}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Submit and cancel buttons */}
            {showForm && (
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
                    <div className="container mx-auto max-w-3xl flex justify-between gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg hover:bg-secondary transition-colors"
                        >
                            Atšaukti
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Išsaugoma...' : 'Išsaugoti visus įvertinimus'}
                        </button>
                    </div>
                </div>
            )}

            {/* Space at bottom when form is open */}
            {showForm && <div className="h-24" />}
        </form>
    );
}