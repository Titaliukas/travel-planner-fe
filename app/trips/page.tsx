'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Trip from '@/types/Trip';
import { TripCard } from '@/app/trips/components/TripCard';
import { CreateModal } from '@/app/trips/components/CreateModal';
import { SkeletonCard } from '@/app/trips/components/SkeletonCard';

export default function TripsPage() {
	const searchParams = useSearchParams();
	const user_id = searchParams.get('userId') ?? '1';

	const [trips, setTrips] = useState<Trip[]>([]);
	const [loading, setLoading] = useState(true);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	useEffect(() => {
		if (!user_id) return;
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/user/${user_id}`)
			.then((r) => r.json())
			.then((data) => {
				setTrips(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, [user_id, refreshKey]);

	return (
		<main className='flex-1 pt-16'>
			<div className='max-w-5xl mx-auto px-6 py-10'>
				<div className='flex items-center justify-between mb-8'>
					<div>
						<h1 className="font-['Outfit'] text-2xl font-bold text-foreground">Mano kelionės</h1>
						{!loading && <p className='text-sm text-muted-foreground mt-1'>{trips.length} kelionės</p>}
					</div>
					<button
						onClick={() => setCreateModalOpen(true)}
						className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 hover:cursor-pointer'
					>
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

			{createModalOpen && (
				<CreateModal
					userId={user_id}
					onClose={() => setCreateModalOpen(false)}
					onCreated={() => {
						setCreateModalOpen(false);
						setRefreshKey((k) => k + 1);
					}}
				/>
			)}
		</main>
	);
}
