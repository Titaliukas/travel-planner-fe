'use client';

import { AttractionListItem } from '@/app/sights/components/AttractionListItem';
import { useState } from 'react';

interface Attraction {
	id: string;
	name: string;
	city: string;
	address: string;
	image: string;
	category: string;
	match: number;
	rating: number;
	reviewCount: number;
	duration: string;
	description: string;
	fullDescription: string;
	tags: string[];
	schedule: { day: string; hours: string }[];
	coordinates: { lat: number; lng: number };
}

const mockAttractions: Attraction[] = [
	{
		id: '1',
		name: 'Gedimino kalnas',
		city: 'Vilnius, Vilniaus apskritis',
		address: 'Arsenalo g. 5, Vilnius',
		image: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Gedimino_pilis_by_Augustas_Didzgalvis.jpg',
		category: 'Istorija',
		match: 95,
		rating: 4.8,
		reviewCount: 3247,
		duration: '~1 val.',
		description: 'Simbolinė Vilniaus vieta su Gedimino bokštu ir nuostabia panorama.',
		fullDescription:
			'Gedimino kalnas – vienas svarbiausių Vilniaus simbolių. Ant kalno stūkso Gedimino pilies bokštas, iš kurio atsiveria nuostabi senojo Vilniaus panorama. Kalnas yra archeologinis, istorinis ir kultūrinis paminklas, pritraukiantis tūkstančius lankytojų kasmet.',
		tags: ['Istorija', 'Bokštas', 'Panorama'],
		schedule: [
			{ day: 'Antradienis–Sekmadienis', hours: '10:00–18:00' },
			{ day: 'Pirmadienis', hours: 'Uždaryta' },
		],
		coordinates: { lat: 54.6869, lng: 25.2903 },
	},
	{
		id: '2',
		name: 'Kryžių kalnas',
		city: 'Šiauliai, Šiaulių apskritis',
		address: 'Jurgaičių kaimas',
		image: 'https://www.turistopasaulis.lt/wp-content/uploads/2013/10/kry%C5%BEi%C5%B3-kalnas-05.jpg',
		category: 'Religija',
		match: 92,
		rating: 4.9,
		reviewCount: 2841,
		duration: '~1 val.',
		description: 'Unikalus piligrimystės centras su tūkstančiais kryžių.',
		fullDescription:
			'Kryžių kalnas – vienas žinomiausių Lietuvos piligrimystės centrų, pritraukiantis tūkstančius lankytojų kasmet. Šis unikalus religinis kompleksas, kurį sudaro dešimtys tūkstančių kryžių, liudija lietuvių tautos tikėjimą ir pasiaukojimą. Vieta įtraukta į UNESCO paveldą.',
		tags: ['Religija', 'Piligrimystė', 'UNESCO'],
		schedule: [{ day: 'Kasdien', hours: '24/7' }],
		coordinates: { lat: 56.0154, lng: 23.4175 },
	},
	{
		id: '3',
		name: 'Trijų kryžių kalnas',
		city: 'Vilnius, Vilniaus apskritis',
		address: 'Kalnai parkas, Vilnius',
		image: 'https://tobuladovana.lt/images/blog/5/triju-kryziu-kalnas.jpeg',
		category: 'Istorija',
		match: 88,
		rating: 4.7,
		reviewCount: 1892,
		duration: '~1 val.',
		description: 'Monumentalus paminklas su nuostabia miesto panorama.',
		fullDescription:
			'Trijų kryžių kalnas – vienas populiariausių Vilniaus apžvalgos taškų. Ant kalno stovi trys balti betoniniai kryžiai, pastatyti 1989 metais vietoje 1916 m. pastatytų medinių kryžių. Nuo kalno atsiveria įspūdinga Vilniaus senamiestis panorama.',
		tags: ['Istorija', 'Paminklas', 'Panorama'],
		schedule: [{ day: 'Kasdien', hours: '24/7' }],
		coordinates: { lat: 54.6884, lng: 25.2992 },
	},
	{
		id: '4',
		name: 'Trakų pilis',
		city: 'Trakai, Vilniaus apskritis',
		address: 'Karaimų g. 41, Trakai',
		image: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Traku_pilis_by_Augustas_Didzgalvis.jpg',
		category: 'Istorija',
		match: 95,
		rating: 4.8,
		reviewCount: 4847,
		duration: '~2 val.',
		description: 'Vienas gražiausių Lietuvos pilių kompleksų, esantis saloje Galvės ežere.',
		fullDescription:
			'Trakų salos pilis – vienas iš labiausiai turistų lankomas objektų Lietuvoje. Ši XIV a. pabaigoje pastatyta gotinė pilis yra vienintelė vandeniu apsuptų pilių Rytų Europoje. Čia įsikūręs Trakų istorijos muziejus, vyksta įvairūs renginiai ir festivaliai.',
		tags: ['Istorija', 'Pilis', 'Muziejus'],
		schedule: [
			{ day: 'Antradienis–Sekmadienis', hours: '10:00–18:00' },
			{ day: 'Pirmadienis', hours: 'Uždaryta' },
		],
		coordinates: { lat: 54.6524, lng: 24.9347 },
	},
	{
		id: '5',
		name: 'Puntuko akmuo',
		city: 'Anykščiai, Utenos apskritis',
		address: 'Puntuko akmens takas, Anykščiai',
		image: 'https://upload.wikimedia.org/wikipedia/lt/b/b6/LT_Anyksciai_Puntukas_01.jpg',
		category: 'Gamta',
		match: 85,
		rating: 4.6,
		reviewCount: 967,
		duration: '~1 val.',
		description: 'Didžiausias riedulys Lietuvoje, apipintas legendomis.',
		fullDescription:
			'Puntuko akmuo – didžiausias riedulys Lietuvoje, kurio tūris siekia 265 kubinių metrų. Šis unikalus gamtos paminklas apipintas daugybe legendų ir pasakojimų. Akmuo yra populiari turistų lankoma vieta Anykščių rajone.',
		tags: ['Gamta', 'Riedulys', 'Legendos'],
		schedule: [{ day: 'Kasdien', hours: '24/7' }],
		coordinates: { lat: 55.5333, lng: 25.1167 },
	},
];

export default function AttractionsPage() {
	const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

	const handleAttractionSelect = (attraction: Attraction) => {
		setSelectedAttraction(attraction);
	};

	const mapCenter = selectedAttraction
		? `${selectedAttraction.coordinates.lat},${selectedAttraction.coordinates.lng}`
		: '55.1694,23.8813'; // Center of Lithuania

	return (
		<div className='min-h-screen'>
			{/* Main Content - Split View */}
			<div className='mt-16 flex h-[calc(100vh-4rem)]'>
				{/* Left Half - Attraction List */}
				<div className='w-1/2 overflow-y-auto border-r border-border'>
					<div className='p-6'>
						{/* Page Header */}
						<div className='mb-6'>
							<h1 className='mb-2'>Lankytinos vietos</h1>
							<p className='text-muted-foreground'>Raskite įdomių vietų savo kelionei</p>
						</div>

						{/* Results count */}
						<p className='text-sm text-muted-foreground mb-4'>
							Rasta <span className='font-semibold text-foreground'>5</span> vietos
						</p>

						{/* Attraction List */}
						<div className='space-y-3'>
							{mockAttractions.map((attraction) => (
								<AttractionListItem
									key={attraction.id}
									id={attraction.id}
									name={attraction.name}
									city={attraction.city}
									address={attraction.address}
									image={attraction.image}
									category={attraction.category}
									rating={attraction.rating}
									reviewCount={attraction.reviewCount}
									duration={attraction.duration}
									description={attraction.description}
									fullDescription={attraction.fullDescription}
									tags={attraction.tags}
									schedule={attraction.schedule}
									onSelect={() => handleAttractionSelect(attraction)}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Right Half - Google Maps */}
				<div className='w-1/2 relative'>
					<iframe
						src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${mapCenter}&zoom=14&maptype=roadmap`}
						className='w-full h-full border-0'
						allowFullScreen
						loading='lazy'
						referrerPolicy='no-referrer-when-downgrade'
						title='Google Maps'
					/>
					{selectedAttraction && (
						<div className='absolute top-4 left-4 right-4 bg-card rounded-lg shadow-lg p-4 border border-border'>
							<h3 className='mb-1'>{selectedAttraction.name}</h3>
							<p className='text-sm text-muted-foreground'>{selectedAttraction.address}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
