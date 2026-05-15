'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TravellersPage() {
    const searchParams = useSearchParams();
    const tripId = searchParams.get('tripId') || '2';
    const userId = 1;

    const [travelers, setTravelers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTravelers = async () => {
        try {
            const response = await fetch(`http://localhost:5011/Trip/${tripId}/travelers`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setTravelers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Klaida gaunant dalyvius:', error);
            setError('Nepavyko gauti kelionės dalyvių');
            setTravelers([]);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:5011/Trip/users/all');
            const data = await response.json();
            console.log('Gauti vartotojai iš API:', data);
            setAllUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Klaida gaunant vartotojus:', error);
            setAllUsers([]);
        }
    };

    const handleAddTravelers = async () => {
        if (selectedUsers.length === 0) {
            alert('Pasirinkite bent vieną vartotoją');
            return;
        }

        setActionLoading(true);
        try {
            const response = await fetch(`http://localhost:5011/Trip/${tripId}/travelers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedUsers),
            });

            if (response.ok) {
                alert('Keliautojai sėkmingai pridėti!');
                setSelectedUsers([]);
                setShowAddModal(false);
                await fetchTravelers();
            }
        } catch (error) {
            console.error('Klaida pridedant:', error);
            alert('Nepavyko pridėti keliautojų');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveTraveler = async (userIdToRemove: number) => {
        if (!confirm('Ar tikrai norite pašalinti šį keliautoją?')) return;

        setActionLoading(true);
        try {
            const response = await fetch(`http://localhost:5011/Trip/${tripId}/travelers`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([userIdToRemove]),
            });

            if (response.ok) {
                alert('Keliautojas pašalintas!');
                await fetchTravelers();
            }
        } catch (error) {
            console.error('Klaida šalinant:', error);
            alert('Nepavyko pašalinti keliautojo');
        } finally {
            setActionLoading(false);
        }
    };

    const toggleUserSelection = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        const travelerIds = travelers.map((t: any) => t.Id || t.id);
        const availableUsersList = allUsers.filter((u: any) => !travelerIds.includes(u.Id || u.id));
        
        if (selectedUsers.length === availableUsersList.length && availableUsersList.length > 0) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(availableUsersList.map((u: any) => u.Id || u.id));
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([fetchTravelers(), fetchAllUsers()]);
            setLoading(false);
        };
        loadData();
    }, [tripId]);

    if (loading) return <div className="p-4 text-center">Kraunama...</div>;
    
    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-2xl text-center">
                <p className="text-destructive mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
                >
                    Bandyti dar kartą
                </button>
            </div>
        );
    }

    // Naudojame Id, Username, Mail (didžiosios raidės)
    const travelerIds = travelers.map((t: any) => t.Id || t.id);
    const availableUsers = allUsers.filter((u: any) => !travelerIds.includes(u.Id || u.id));

    console.log('Visi vartotojai:', allUsers);
    console.log('Kelionės dalyviai:', travelers);
    console.log('Galimi vartotojai:', availableUsers);

    return (
        <div className="container mx-auto p-4 max-w-2xl pt-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Kelionės dalyviai</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelionės ID: {tripId} | Iš viso: {travelers.length} keliautojų
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                    + Pridėti keliautoją
                </button>
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-semibold">Dalyvių sąrašas</h2>
                {travelers.length === 0 ? (
                    <div className="text-center p-8 border border-border rounded-lg text-muted-foreground">
                        Kol kas nėra keliautojų
                    </div>
                ) : (
                    travelers.map((traveler: any) => (
                        <div
                            key={traveler.Id || traveler.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                            <div>
                                <p className="font-semibold">{traveler.Username || traveler.username || 'Nežinomas'}</p>
                                <p className="text-sm text-muted-foreground">{traveler.Mail || traveler.mail || 'Trūksta el. pašto'}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveTraveler(traveler.Id || traveler.id)}
                                disabled={actionLoading}
                                className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
                            >
                                Pašalinti
                            </button>
                        </div>
                    ))
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Pridėti keliautojų</h2>
                        
                        {!allUsers.length ? (
                            <p className="text-muted-foreground text-center py-4">
                                Kraunami vartotojai...
                            </p>
                        ) : availableUsers.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">
                                Nėra galimų vartotojų pridėjimui
                            </p>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === availableUsers.length && availableUsers.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-medium">Pažymėti visus</span>
                                    </label>
                                </div>

                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {availableUsers.map((user: any) => (
                                        <label
                                            key={user.Id || user.id}
                                            className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.Id || user.id)}
                                                onChange={() => toggleUserSelection(user.Id || user.id)}
                                                className="w-4 h-4"
                                            />
                                            <div>
                                                <p className="font-medium">{user.Username || user.username || 'Nežinomas vartotojas'}</p>
                                                <p className="text-sm text-muted-foreground">{user.Mail || user.mail || 'Trūksta el. pašto'}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedUsers([]);
                                }}
                                className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg hover:bg-secondary transition-colors"
                            >
                                Atšaukti
                            </button>
                            <button
                                onClick={handleAddTravelers}
                                disabled={actionLoading || selectedUsers.length === 0 || !availableUsers.length}
                                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? 'Pridedama...' : 'Pridėti'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}