'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const backend_url = "http://localhost:5011";

export default function TripsPage() {
    const searchParams = useSearchParams();
    const user_id = searchParams.get('userId');
    const [trips, setTrips] = useState(null);

    useEffect(() => {
        if (!user_id) return;
        fetch(`${backend_url}/trip/user/${user_id}`)
            .then(r => r.json())
            .then(setTrips);
    }, [user_id]);

    return (
        <pre>{JSON.stringify(trips, null, 2)}</pre>
    );
}