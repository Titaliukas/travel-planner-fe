import { GripVertical, X, Clock } from 'lucide-react';

interface Place {
	id: string;
	name: string;
	category: string;
	image: string;
	duration: string;
	day: number;
}

interface PlacesListProps {
	places: Place[];
	onRemove: (id: string) => void;
}

export function PlacesList({ places, onRemove }: PlacesListProps) {
	return (
		<div className='bg-card border border-border rounded-xl p-6'>
			<h3 className='mb-4'>Lankytinos vietos</h3>

			<div className='space-y-3 mb-4'>
				{places.map((place, index) => (
					<div
						key={place.id}
						className='flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors group'
					>
						{/* Drag Handle */}
						<button className='text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing'>
							<GripVertical className='w-5 h-5' />
						</button>

						{/* Number */}
						<div className='w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm flex-shrink-0'>
							{index + 1}
						</div>

						{/* Image */}
						<img src={place.image} alt={place.name} className='w-14 h-14 rounded-lg object-cover flex-shrink-0' />

						{/* Info */}
						<div className='flex-1 min-w-0'>
							<div className='flex items-center gap-2 mb-1'>
								<h4 className='truncate text-sm'>{place.name}</h4>
								<span className='px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold flex-shrink-0'>
									{place.category}
								</span>
							</div>
							<div className='flex items-center gap-3 text-xs text-muted-foreground'>
								<div className='flex items-center gap-1'>
									<Clock className='w-3 h-3' />
									<span>{place.duration}</span>
								</div>
								<span className='px-2 py-0.5 bg-accent/10 text-accent rounded-full font-semibold'>
									{place.day} diena
								</span>
							</div>
						</div>

						{/* Remove Button */}
						<button
							onClick={() => onRemove(place.id)}
							className='p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100'
						>
							<X className='w-4 h-4' />
						</button>
					</div>
				))}
			</div>

			{/* Add Place Button */}
			<button className='w-full py-3 border-2 border-dashed border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold'>
				+ Pridėti vietą
			</button>
		</div>
	);
}
