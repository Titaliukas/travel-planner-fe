'use client';

import { useState } from 'react';
import { ChevronRight, Trash2, Play } from 'lucide-react';
import { TripHeader } from '@/app/trip/[tripId]/components/TripHeader';
import { TabNavigation } from '@/app/trip/[tripId]/components/TabNavigation';
import { PlacesList } from '@/app/trip/[tripId]/components/PlacesList';
import { TripDays } from '@/app/trip/[tripId]/components/TripDays';
import { ParticipantsCard } from '@/app/trip/[tripId]/components/ParticipantsCard';
import { AccommodationCard } from '@/app/trip/[tripId]/components/AccommodationCard';
import { PackingListCard } from '@/app/trip/[tripId]/components/PackingListCard';

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

	return (
		<div className='min-h-screen bg-background pb-24'>
			{/* Content */}
			<div className='mt-16 max-w-7xl mx-auto px-8 py-6'>
				{/* Breadcrumb */}
				<div className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
					<a href='#' className='hover:text-foreground transition-colors'>
						Mano kelionės
					</a>
					<ChevronRight className='w-4 h-4' />
					<span className='text-foreground font-semibold'>Vasaros kelionė po Lietuvą</span>
				</div>

				{/* Trip Header */}
				<div className='mb-6'>
					<TripHeader
						title='Vasaros kelionė po Lietuvą'
						status='active'
						dateRange='2025-07-15 – 2025-07-18'
						placesCount={8}
						participants={3}
						hasAccommodation={true}
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
					<button className='flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors font-semibold'>
						<Trash2 className='w-4 h-4' />
						<span>Ištrinti kelionę</span>
					</button>
					<button className='flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 font-semibold'>
						<Play className='w-5 h-5' />
						<span>Pradėti kelionę</span>
					</button>
				</div>
			</div>
		</div>
	);
}
