'use client';

import { useEffect, useState } from 'react';
import { Interest, UserInterest, SaveInterestDto } from './types';
import InterestForm from './components/InterestForm';

export default function InterestsPage() {
    const userId = 1;
    const [formType, setFormType] = useState<'first' | 'edit' | null>(null);
    const [interests, setInterests] = useState<Interest[] | UserInterest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFormType = async () => {
            try {
                const response = await fetch(`http://localhost:5011/Interest/form/${userId}`);
                const type = await response.text();
                setFormType(type as 'first' | 'edit');
                
                if (type === 'first') {
                    const interestsRes = await fetch('http://localhost:5011/Interest/all');
                    const allInterests = await interestsRes.json();
                    setInterests(allInterests);
                } else {
                    const userInterestsRes = await fetch(`http://localhost:5011/Interest/user/${userId}/interests`);
                    const userInterests = await userInterestsRes.json();
                    setInterests(userInterests);
                }
            } catch (error) {
                console.error('Klaida:', error);
            } finally {
                setLoading(false);
            }
        };

        getFormType();
    }, [userId]);

    const handleSave = async (scores: Record<number, number>) => {
        const saveData: SaveInterestDto[] = Object.entries(scores).map(([interestId, score]) => ({
            interestId: Number(interestId),
            score: score
        }));

        try {
            const response = await fetch(`http://localhost:5011/Interest/user/${userId}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });

            if (response.ok) {
                alert('Interesai sėkmingai išsaugoti!');
                if (formType === 'first') {
                    setFormType('edit');
                    const userInterestsRes = await fetch(`http://localhost:5011/Interest/user/${userId}/interests`);
                    const userInterests = await userInterestsRes.json();
                    setInterests(userInterests);
                }
            }
        } catch (error) {
            console.error('Klaida išsaugant:', error);
        }
    };

    if (loading) return <div className="p-4">Kraunama...</div>;

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">
                {formType === 'first' ? 'Pasirinkite savo pomėgius' : 'Mano pomėgiai'}
            </h1>
            
            <InterestForm
                formType={formType}
                interests={interests}
                onSave={handleSave}
            />
        </div>
    );
}