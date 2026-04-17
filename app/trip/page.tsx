'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Trash2, CircleStop, CirclePlay, CirclePause, X, RotateCcw } from 'lucide-react';
import { TripHeader } from '@/app/trip/components/TripHeader';
import { TabNavigation } from '@/app/trip/components/TabNavigation';
import { PlacesList } from '@/app/trip/components/PlacesList';
import { ParticipantsCard } from '@/app/trip/components/ParticipantsCard';
import { AccommodationCard } from '@/app/trip/components/AccommodationCard';
import { PackingListCard } from '@/app/trip/components/PackingListCard';
import { useRouter, useSearchParams } from 'next/navigation';
import Trip from '@/types/Trip';
import { TripDays } from '@/app/trip/components/TripDays';
import DeleteModal from '@/app/trip/components/DeleteModal';
import UpdateModal from '@/app/trip/components/UpdateModal';

interface Place {
	id: string;
	name: string;
	category: string;
	image: string;
	duration: string;
	day: number;
}

export default function TripDetailPage() {
	const [activeTab, setActiveTab] = useState('overview');

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	// Mock data
	const places: Place[] = [
		{
			id: '1',
			name: 'Gedimino kalnas',
			category: 'Istorija',
			image: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Gedimino_pilis_by_Augustas_Didzgalvis.jpg',
			duration: '~1 val.',
			day: 1,
		},
		{
			id: '2',
			name: 'Trijų kryžių kalnas',
			category: 'Istorija',
			image: 'https://tobuladovana.lt/images/blog/5/triju-kryziu-kalnas.jpeg',
			duration: '~1 val.',
			day: 1,
		},
		{
			id: '3',
			name: 'Trakų pilis',
			category: 'Istorija',
			image: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Traku_pilis_by_Augustas_Didzgalvis.jpg',
			duration: '~2 val.',
			day: 2,
		},
		{
			id: '4',
			name: 'Kryžių kalnas',
			category: 'Religija',
			image:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kry%C5%BEi%C5%B3_kalnas_%28G%C3%B3ra_Krzy%C5%BCy%29.JPG/960px-Kry%C5%BEi%C5%B3_kalnas_%28G%C3%B3ra_Krzy%C5%BCy%29.JPG',
			duration: '~1 val.',
			day: 3,
		},
	];

	const tripDays = [
		{
			day: 1,
			date: 'Liepos 15',
			totalDuration: '~6 val.',
			places: [
				{
					id: '1',
					name: 'Gedimino kalnas',
					time: '09:00',
					duration: '~1 val.',
				},
				{
					id: '2',
					name: 'Trijų kryžių kalnas',
					time: '11:30',
					duration: '~1 val.',
				},
				{
					id: '3',
					name: 'Pietūs senamiestyje',
					time: '13:00',
					duration: '~1.5 val.',
				},
			],
		},
		{
			day: 2,
			date: 'Liepos 16',
			totalDuration: '~5 val.',
			places: [
				{
					id: '4',
					name: 'Trakų pilis',
					time: '10:00',
					duration: '~2 val.',
				},
				{
					id: '5',
					name: 'Karaimų restoranai',
					time: '13:00',
					duration: '~1.5 val.',
				},
			],
		},
		{
			day: 3,
			date: 'Liepos 17',
			totalDuration: '~4 val.',
			places: [
				{
					id: '6',
					name: 'Kryžių kalnas',
					time: '10:00',
					duration: '~1 val.',
				},
			],
		},
	];

	const participants = [
		{ id: '1', name: 'Jonas Jonaitis', role: 'organizer' as const },
		{ id: '2', name: 'Petras Petraitis', role: 'participant' as const },
		{ id: '3', name: 'Ona Onaitė', role: 'participant' as const },
	];

	const hotel = {
		name: 'Radisson Blu Hotel Lietuva',
		address: 'Konstitucijos pr. 20, Vilnius',
		image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop',
		pricePerNight: 95,
		rooms: 2,
	};

	const handleRemovePlace = (id: string) => {
		console.log('Remove place:', id);
	};

	function getTripStatus(trip: Trip) {
		if (trip.IsCancelled) return 'Atšaukta';
		if (trip.IsPaused) return 'Sustabdyta';

		if (!trip.Start) return 'Planuojama';
		if (!trip.End) return 'Vykdoma';

		return 'Baigta';
	}

	async function startTrip(tripId: string) {
		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}/start`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				start: new Date().toISOString(),
			}),
		});
	}

	async function endTrip(tripId: string) {
		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}/end`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				end: new Date().toISOString(),
			}),
		});
	}

	async function pauseTrip(tripId: string) {
		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}/pause`, {
			method: 'PATCH',
		});
	}

	async function cancelTrip(tripId: string) {
		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}/cancel`, {
			method: 'PATCH',
		});
	}

	async function restoreTrip(tripId: string) {
		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}/restore`, {
			method: 'PATCH',
		});
	}

	const router = useRouter();

	function openTripsPage() {
		router.push(`/trips?userId=${user_id}`);
	}

	const searchParams = useSearchParams();
	const trip_id = searchParams.get('tripId') ?? '1';

	const user_id = 1;

	const [trip, setTrip] = useState<Trip | null>(null);
	const [loading, setLoading] = useState(true);

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [updateOpen, setUpdateOpen] = useState(false);

	async function fetchTrip(tripId: string) {
		if (!tripId) return;

		setLoading(true);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}`);

			if (!res.ok) throw new Error('Trip not found');

			const data = await res.json();
			setTrip(data);
		} catch (err) {
			console.error(err);
			setTrip(null);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!trip_id) return;
		fetchTrip(trip_id);
	}, [trip_id]);

	if (loading) return <div>Loading...</div>;
	if (!trip) return <div>No trip found</div>;

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Content */}
			<div className='mt-16 max-w-7xl mx-auto px-8 py-6'>
				{/* Breadcrumb */}
				<div className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
					<button onClick={openTripsPage} className='hover:text-foreground transition-colors'>
						Mano kelionės
					</button>
					<ChevronRight className='w-4 h-4' />
					<span className='text-foreground font-semibold'>{trip.Name}</span>
				</div>

				{/* Trip Header */}
				<div className='mb-6'>
					<TripHeader
						title={trip.Name}
						status={getTripStatus(trip)}
						placesCount={8}
						participants={3}
						hasAccommodation={true}
						onUpdate={() => setUpdateOpen(true)}
					/>
				</div>

				{/* Tab Navigation */}
				<div className='mb-6'>
					<TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
				</div>

				{/* Tab Content - Overview */}
				{activeTab === 'overview' && (
					<div className='grid grid-cols-5 gap-6'>
						{/* Left Column - 60% */}
						<div className='col-span-3 space-y-6'>
							{/* Places List */}
							<PlacesList places={places} onRemove={handleRemovePlace} />

							{/* Trip Days */}
							<TripDays days={tripDays} />
						</div>

						{/* Right Column - 40% */}
						<div className='col-span-2 space-y-6'>
							{/* Participants */}
							<ParticipantsCard participants={participants} />

							{/* Accommodation */}
							<AccommodationCard hotel={hotel} />

							{/* Packing List */}
							<PackingListCard />
						</div>
					</div>
				)}

				{/* Placeholder for other tabs */}
				{activeTab !== 'overview' && (
					<div className='bg-card border border-border rounded-xl p-12 text-center'>
						<p className='text-muted-foreground'>
							{activeTab === 'route' && 'Maršrutas'}
							{activeTab === 'participants' && 'Dalyviai'}
							{activeTab === 'accommodation' && 'Apgyvendinimas'}
							{activeTab === 'packing' && 'Pakuotės sąrašas'}
						</p>
					</div>
				)}
			</div>

			{/* Sticky Bottom Action Bar */}
			<div className='fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg'>
				<div className='max-w-7xl mx-auto px-8 py-4 flex items-center justify-between'>
					<div className='flex gap-4'>
						<button
							onClick={() => setDeleteOpen(true)}
							className='flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors font-semibold hover:cursor-pointer'
						>
							<Trash2 className='w-4 h-4' />
							<span>Ištrinti kelionę</span>
						</button>
						{getTripStatus(trip) !== 'Atšaukta' ? (
							<button
								onClick={async () => {
									await cancelTrip(trip_id);
									fetchTrip(trip_id);
								}}
								className='flex items-center gap-2 px-8 py-3 bg-destructive text-primary-foreground rounded-lg hover:bg-destructive/80 transition-colors shadow-lg shadow-primary/20 font-semibold hover:cursor-pointer'
							>
								<X className='w-5 h-5' />
								<span>Atšaukti kelionę</span>
							</button>
						) : (
							<button
								onClick={async () => {
									await restoreTrip(trip_id);
									fetchTrip(trip_id);
								}}
								className='flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg  transition-colors shadow-lg shadow-primary/20 font-semibold hover:bg-primary/90 hover:cursor-pointer'
							>
								<RotateCcw className='w-5 h-5' />
								<span>Atkurti kelionę</span>
							</button>
						)}
					</div>
					{getTripStatus(trip) === 'Planuojama' || getTripStatus(trip) === 'Sustabdyta' ? (
						<button
							onClick={async () => {
								await startTrip(trip_id);
								fetchTrip(trip_id);
							}}
							className='flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 font-semibold hover:cursor-pointer'
						>
							<CirclePlay className='w-5 h-5' />
							<span>Pradėti kelionę</span>
						</button>
					) : getTripStatus(trip) === 'Vykdoma' ? (
						<div className='flex gap-2'>
							<button
								onClick={async () => {
									await pauseTrip(trip_id);
									fetchTrip(trip_id);
								}}
								className='flex items-center gap-2 px-8 py-3 bg-warning text-primary-foreground rounded-lg hover:bg-warning/70 transition-colors shadow-lg shadow-primary/20 font-semibold hover:cursor-pointer'
							>
								<CirclePause className='w-5 h-5' />
								<span>Sustabdyti kelionę</span>
							</button>
							<button
								onClick={async () => {
									await endTrip(trip_id);
									fetchTrip(trip_id);
								}}
								className='flex items-center gap-2 px-8 py-3 bg-destructive text-primary-foreground rounded-lg hover:bg-destructive/80 transition-colors shadow-lg shadow-primary/20 font-semibold hover:cursor-pointer'
							>
								<CircleStop className='w-5 h-5' />
								<span>Baigti kelionę</span>
							</button>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>

			{deleteOpen && <DeleteModal tripId={trip_id} userId={user_id} onClose={() => setDeleteOpen(false)} />}
			{updateOpen && (
				<UpdateModal
					trip={trip}
					onClose={() => setUpdateOpen(false)}
					onUpdate={() => {
						if (trip_id) fetchTrip(trip_id);
					}}
				/>
			)}
		</div>
	);
}
