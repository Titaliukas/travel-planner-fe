'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';

const backend_url = 'http://localhost:5011';

interface User {
    Id: number;
    Name: string;
}

interface Trip {
    Id: number;
    Name: string;
    Start: string | null;
    End: string | null;
    DayCount: number;
    IsPaused: boolean;
    IsCancelled: boolean;
    OwnerId: number;
    Owner?: User;
    Travelers?: User[];
}

interface TripForm {
    Name: string;
    Start: string;
    End: string;
}

const AVATAR_COLORS = [
    'bg-blue-100 text-blue-700',
    'bg-rose-100 text-rose-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-purple-100 text-purple-700',
    'bg-sky-100 text-sky-700',
];

// Simplified Labels
const STATUS_LABELS = {
    paused: 'Pristabdyta',
    cancelled: 'Atšaukta',
};

// Simplified Badge Styles
const STATUS_BADGE = {
    paused: 'bg-amber-50 text-amber-700',
    cancelled: 'bg-red-50 text-red-700',
};

// Simplified Top Bar Styles
const STATUS_BAR = {
    paused: 'bg-amber-400',
    cancelled: 'bg-red-500',
};

// Logic: Returns status key only if a flag is true
function getTripStatus(trip: Trip): 'paused' | 'cancelled' | null {
    if (trip.IsCancelled) return 'cancelled';
    if (trip.IsPaused) return 'paused';
    return null;
}

function formatDate(dateStr: string | null): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('lt-LT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function initials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function TripCard({ trip }: { trip: Trip }) {
    const status = getTripStatus(trip);
    const startFmt = formatDate(trip.Start);
    const endFmt = formatDate(trip.End);
    const dateStr =
        startFmt && endFmt
            ? `${startFmt} – ${endFmt}`
            : startFmt
            ? `nuo ${startFmt}`
            : 'Data nenustatyta';

    const travelers = Array.isArray(trip.Travelers) ? trip.Travelers : [];
    const visibleTravelers = travelers.slice(0, 3);
    const extraCount = travelers.length - 3;

    return (
        <div className='relative bg-card border border-border rounded-xl p-5 hover:border-border/60 hover:shadow-sm transition-all cursor-pointer overflow-hidden'>
            {/* Top accent bar: Only shows if paused or cancelled */}
            {status && <div className={`absolute top-0 left-0 right-0 h-0.5 ${STATUS_BAR[status]}`} />}

            <div className='mt-2 mb-2'>
                <h3 className="font-['Outfit'] font-semibold text-base text-foreground leading-snug">
                    {trip.Name}
                </h3>
            </div>

            {/* Badge: Only shows if status is paused or cancelled */}
            {status && (
                <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[status]}`}>
                    {STATUS_LABELS[status]}
                </span>
            )}

            <div className='flex items-center gap-1.5 mt-3 text-xs text-muted-foreground'>
                <Calendar className='w-3 h-3 shrink-0' />
                <span>{dateStr}</span>
            </div>

            <div className='flex items-center justify-between mt-3 pt-3 border-t border-border'>
                <div className='flex items-baseline gap-1'>
                    <span className='text-lg font-semibold text-foreground'>{trip.DayCount}</span>
                    <span className='text-xs text-muted-foreground'>d.</span>
                </div>

                {travelers.length === 0 ? (
                    <span className='text-xs text-muted-foreground'>Tik tu</span>
                ) : (
                    <div className='flex items-center'>
                        {visibleTravelers.map((user, i) => (
                            <div
                                key={user.Id}
                                title={user.Name}
                                className={`w-7 h-7 rounded-full text-[10px] font-medium flex items-center justify-center border-2 border-card ${AVATAR_COLORS[i % AVATAR_COLORS.length]} ${i > 0 ? '-ml-2' : ''}`}
                            >
                                {initials(user.Name)}
                            </div>
                        ))}
                        {extraCount > 0 && (
                            <div className='-ml-2 w-7 h-7 rounded-full text-[10px] font-medium flex items-center justify-center border-2 border-card bg-muted text-muted-foreground'>
                                +{extraCount}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className='bg-card border border-border rounded-xl p-5 animate-pulse'>
            <div className='h-4 bg-muted rounded w-3/4 mb-3 mt-2' />
            <div className='h-3 bg-muted rounded w-1/3 mb-3' />
            <div className='h-3 bg-muted rounded w-1/2' />
            <div className='mt-4 pt-3 border-t border-border flex justify-between'>
                <div className='h-5 bg-muted rounded w-10' />
                <div className='h-5 bg-muted rounded w-16' />
            </div>
        </div>
    );
}

interface CreateModalProps {
    userId: string;
    onClose: () => void;
}

function CreateModal({ userId, onClose }: CreateModalProps) {
    const [form, setForm] = useState<TripForm>({ Name: '', Start: '', End: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    function setField<K extends keyof TripForm>(field: K, value: TripForm[K]) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function submit() {
        setSubmitting(true);
        setError(null);
        try {
            const body = {
                ...form,
                Start: form.Start || null,
                End: form.End || null,
                OwnerId: Number(userId),
            };
            const res = await fetch(`${backend_url}/trip/user/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                redirect: 'manual',
            });

            // Handle the 302/0 status according to your sequence diagram
            if (res.status === 0 || res.ok) {
                window.location.href = `${backend_url}/trip/openTripsPage?userId=${userId}`;
                return;
            }

            const msg = await res.text();
            setError(msg || `Klaida: ${res.status}`);
        } catch (e: unknown) {
            window.location.href = `${backend_url}/trip/openTripsPage?userId=${userId}`;
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            ref={backdropRef}
            onClick={(e) => e.target === backdropRef.current && onClose()}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'
        >
            <div className='w-full max-w-md bg-card rounded-2xl border border-border shadow-xl'>
                <div className='flex items-center justify-between px-6 py-4 border-b border-border'>
                    <h2 className="font-['Outfit'] font-bold text-lg text-foreground">Nauja kelionė</h2>
                    <button onClick={onClose} className='w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors'>
                        <X className='w-4 h-4' />
                    </button>
                </div>
                <div className='px-6 py-5 flex flex-col gap-4'>
                    <div>
                        <label className='block text-sm font-semibold text-foreground mb-1'>Pavadinimas</label>
                        <input
                            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30'
                            value={form.Name}
                            onChange={(e) => setField('Name', e.target.value)}
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label className='block text-sm font-semibold text-foreground mb-1'>Pradžia</label>
                            <input type='date' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground' value={form.Start} onChange={(e) => setField('Start', e.target.value)} />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-foreground mb-1'>Pabaiga</label>
                            <input type='date' className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground' value={form.End} onChange={(e) => setField('End', e.target.value)} />
                        </div>
                    </div>
                    {error && <p className='text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg'>{error}</p>}
                </div>
                <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-border'>
                    <button onClick={onClose} className='px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-lg'>Atšaukti</button>
                    <button onClick={submit} disabled={submitting} className='px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg disabled:opacity-50'>
                        {submitting ? 'Kuriama...' : 'Sukurti'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TripsPage() {
    const searchParams = useSearchParams();
    const user_id = searchParams.get('userId') ?? '1';

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!user_id) return;
        setLoading(true);
        fetch(`${backend_url}/trip/user/${user_id}`)
            .then((r) => r.json())
            .then((data) => {
                setTrips(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user_id]);

    return (
        <main className='flex-1 pt-16'>
            <div className='max-w-5xl mx-auto px-6 py-10'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h1 className="font-['Outfit'] text-2xl font-bold text-foreground">Mano kelionės</h1>
                        {!loading && <p className='text-sm text-muted-foreground mt-1'>{trips.length} kelionės</p>}
                    </div>
                    <button onClick={() => setModalOpen(true)} className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg'>
                        <Plus className='w-4 h-4' />
                        Sukurti naują kelionę
                    </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : trips.length === 0 ? (
                        <p className='col-span-full text-center text-muted-foreground py-12 text-sm'>Nėra kelionių.</p>
                    ) : (
                        trips.map((trip) => <TripCard key={trip.Id} trip={trip} />)
                    )}
                </div>
            </div>

            {modalOpen && <CreateModal userId={user_id} onClose={() => setModalOpen(false)} />}
        </main>
    );
}