'use client';

import { SightsListItem } from '@/app/sights/components/SightsListItem';
import { SightSkeletonCard } from '@/app/sights/components/SightSkeletonCard';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';

interface Sight {
	Id: string;
	Name: string;
	City: string;
	Address: string;
	PhotoUrl: string;
	Duration: number;
	Description: string;
	FullDescription: string;
	CoordinateX: number;
	CoordinateY: number;
}

const mapContainerStyle = {
	width: '100%',
	height: '100%',
};

export default function SightPage() {
	const [selectedSight, setSelectedSight] = useState<Sight | null>(null);
	const [sights, setSights] = useState<Sight[]>([]);
	const [loading, setLoading] = useState(true);

	const selectSight = (sight: Sight) => {
		setSelectedSight(sight);
	};

	//getSights()
	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sight`)
			.then((r) => r.json())
			.then((data) => {
				setSights(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	const createMarkers = () => {
		return sights.map((sight) => (
			<Marker
				key={sight.Id}
				position={{
					lat: sight.CoordinateY,
					lng: sight.CoordinateX,
				}}
				title={sight.Name}
				onClick={() => selectSight(sight)}
			/>
		));
	};

	const centerMap = (sight?: Sight | null) =>
		sight
			? {
					lat: sight.CoordinateY,
					lng: sight.CoordinateX,
				}
			: {
					lat: 55.1694,
					lng: 23.8813,
				};

	const center = useMemo(() => centerMap(selectedSight), [selectedSight]);

	return (
		<div className='min-h-screen'>
			<div className='mt-16 flex h-[calc(100vh-4rem)]'>
				{/* Left Side */}
				<div className='w-1/2 overflow-y-auto border-r border-border'>
					<div className='p-6'>
						<div className='mb-6'>
							<h1 className='mb-2'>Lankytinos vietos</h1>
							<p className='text-muted-foreground'>Raskite įdomių vietų savo kelionei</p>
						</div>

						<p className='text-sm text-muted-foreground mb-4'>
							Rasta <span className='font-semibold text-foreground'>{sights.length}</span> vietos
						</p>

						<div className='space-y-3'>
							{loading
								? Array.from({ length: 5 }).map((_, i) => <SightSkeletonCard key={i} />)
								: sights.map((sight) => (
										<SightsListItem
											key={sight.Id}
											id={sight.Id}
											name={sight.Name}
											city={sight.City}
											address={sight.Address}
											image={sight.PhotoUrl}
											duration={sight.Duration}
											description={sight.Description}
											fullDescription={sight.FullDescription}
											isExpanded={selectedSight?.Id === sight.Id}
											onToggle={() => {
												if (selectedSight?.Id === sight.Id) {
													setSelectedSight(null);
												} else {
													setSelectedSight(sight);
												}
											}}
										/>
									))}
						</div>
					</div>
				</div>

				{/* Right Side - Google Map */}
				<div className='w-1/2 relative'>
					<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
						<GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={selectedSight ? 14 : 7}>
							{createMarkers()}
						</GoogleMap>
					</LoadScript>

					{selectedSight && (
						<div className='absolute top-4 left-4 right-4 bg-card rounded-lg shadow-lg p-4 border border-border'>
							<h3 className='mb-1'>{selectedSight.Name}</h3>
							<p className='text-sm text-muted-foreground'>{selectedSight.Address}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
