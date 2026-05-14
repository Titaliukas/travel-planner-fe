'use client';

import { useState, useEffect } from 'react';
import { Interest, UserInterest } from '../types';

interface InterestFormProps {
    formType: 'first' | 'edit' | null;
    interests: Interest[] | UserInterest[];
    onSave: (scores: Record<number, number>) => void;
}

export default function InterestForm({ formType, interests, onSave }: InterestFormProps) {
    const [scores, setScores] = useState<Record<number, number>>({});

    useEffect(() => {
        const initialScores: Record<number, number> = {};
        
        if (formType === 'first') {
            (interests as Interest[]).forEach(interest => {
                if (interest?.Id) initialScores[interest.Id] = 1;
            });
        } else {
            (interests as UserInterest[]).forEach(userInterest => {
                if (userInterest?.InterestId) initialScores[userInterest.InterestId] = userInterest.Score;
            });
        }
        
        setScores(initialScores);
    }, [interests, formType]);

    const handleScoreChange = (interestId: number, score: number) => {
        setScores(prev => ({ ...prev, [interestId]: score }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(scores);
    };

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
        return <div className="p-4 text-center">Nėra interesų duomenų.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {formType === 'first' ? (
                <p className="text-muted-foreground mb-4 text-center">
                    Įvertinkite pomėgius pasirinkdami balą:
                    <br />1 = visai nesidomiu, 5 = labai domiuosi
                </p>
            ) : (
                <p className="text-muted-foreground mb-4 text-center">
                    Pakeiskite pomėgių balus:
                    <br />1 = visai nesidomiu, 5 = labai domiuosi
                </p>
            )}

            <div className="space-y-3">
                {interests.map((item) => {
                    let interestId: number | null = null;
                    let interestName = "Nežinomas pomėgis";

                    if (formType === 'first') {
                        const interest = item as Interest;
                        interestId = interest?.Id ?? null;
                        interestName = interest?.Name ?? "Nežinomas pomėgis";
                    } else {
                        const userInterest = item as UserInterest;
                        interestId = userInterest?.InterestId ?? null;
                        interestName = userInterest?.InterestName ?? "Nežinomas pomėgis";
                    }

                    if (interestId === null) {
                        console.warn('Elementas neturi ID:', item);
                        return null;
                    }

                    return (
                        <div key={interestId} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <label className="font-medium flex-1">{interestName}</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(score => (
                                    <button
                                        key={`${interestId}-${score}`}
                                        type="button"
                                        onClick={() => handleScoreChange(interestId, score)}
                                        className={`w-10 h-10 rounded-full transition-colors ${
                                            scores[interestId] === score
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    >
                                        {score}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-accent transition-colors mt-6 font-medium"
            >
                Išsaugoti
            </button>
        </form>
    );
}