import { MapPin, Edit } from 'lucide-react';

interface AccommodationCardProps {
	hotel: {
		name: string;
		address: string;
		image: string;
		pricePerNight: number;
		rooms: number;
	} | null;
}

export function AccommodationCard({ hotel }: AccommodationCardProps) {
	if (!hotel) {
		return (
			<div className='bg-card border border-border rounded-xl p-5'>
				<h4 className='mb-4'>Apgyvendinimas</h4>
				<div className='text-center py-8'>
					<p className='text-muted-foreground mb-4'>Viešbutis dar nepasirinktas</p>
					<button className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
						Pasirinkti viešbutį
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-card border border-border rounded-xl p-5'>
			<h4 className='mb-4'>Apgyvendinimas</h4>

			{/* Hotel Preview */}
			<div className='mb-4'>
				<img src={hotel.image} alt={hotel.name} className='w-full h-32 object-cover rounded-lg mb-3' />
				<h4 className='mb-1 text-sm'>{hotel.name}</h4>
				<div className='flex items-start gap-1 mb-3'>
					<MapPin className='w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0' />
					<p className='text-xs text-muted-foreground'>{hotel.address}</p>
				</div>

				{/* Price and Rooms */}
				<div className='flex items-center justify-between text-sm'>
					<div>
						<span className='font-semibold text-primary'>€{hotel.pricePerNight}</span>
						<span className='text-muted-foreground'> / naktis</span>
					</div>
					<span className='text-muted-foreground'>{hotel.rooms} kambariai</span>
				</div>
			</div>

			{/* Change Hotel Button */}
			<button className='w-full flex items-center justify-center gap-2 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-semibold'>
				<Edit className='w-4 h-4' />
				<span>Keisti viešbutį</span>
			</button>
		</div>
	);
}
