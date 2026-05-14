import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Heart } from 'lucide-react';

interface AttractionListItemProps {
	id: string;
	name: string;
	city: string;
	address: string;
	image: string;
	category: string;
	rating: number;
	reviewCount: number;
	duration: string;
	description: string;
	fullDescription: string;
	tags: string[];
	schedule: { day: string; hours: string }[];
	onSelect: () => void;
}

export function AttractionListItem({
	name,
	city,
	address,
	image,
	category,
	rating,
	reviewCount,
	duration,
	description,
	fullDescription,
	tags,
	schedule,
	onSelect,
}: AttractionListItemProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
		if (!isExpanded) {
			onSelect();
		}
	};

	return (
		<div className='border border-border rounded-xl bg-card overflow-hidden hover:shadow-md hover:shadow-primary/5 transition-all duration-200'>
			{/* Collapsed View */}
			<button
				onClick={handleToggle}
				className='w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors'
			>
				<div className='flex-1'>
					<div className='flex items-center gap-3 mb-1'>
						<h3 className='group-hover:text-primary transition-colors'>{name}</h3>
						<span className='px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold'>
							{category}
						</span>
					</div>
					<div className='flex items-center gap-4 text-sm text-muted-foreground'>
						<div className='flex items-center gap-1'>
							<MapPin className='w-3.5 h-3.5' />
							<span>{city}</span>
						</div>
						<div className='flex items-center gap-1'>
							<div className='flex gap-0.5'>
								{[...Array(5)].map((_, i) => (
									<span
										key={i}
										className={`text-xs ${i < Math.floor(rating) ? 'text-accent' : 'text-muted-foreground/30'}`}
									>
										★
									</span>
								))}
							</div>
							<span className='text-xs'>({reviewCount})</span>
						</div>
						<div className='flex items-center gap-1'>
							<Clock className='w-3.5 h-3.5' />
							<span>{duration}</span>
						</div>
					</div>
				</div>
				<div className='ml-4'>
					{isExpanded ? (
						<ChevronUp className='w-5 h-5 text-muted-foreground' />
					) : (
						<ChevronDown className='w-5 h-5 text-muted-foreground' />
					)}
				</div>
			</button>

			{/* Expanded View */}
			{isExpanded && (
				<div className='border-t border-border p-5 space-y-4 animate-in slide-in-from-top-2 duration-300'>
					{/* Image */}
					<div className='relative h-[240px] rounded-lg overflow-hidden'>
						<img src={image} alt={name} className='w-full h-full object-cover' />
					</div>

					{/* Address */}
					<div className='flex items-start gap-2'>
						<MapPin className='w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0' />
						<div>
							<p className='text-sm font-semibold'>{address}</p>
							<p className='text-sm text-muted-foreground'>{city}</p>
						</div>
					</div>

					{/* Tags */}
					<div className='flex flex-wrap gap-2'>
						{tags.map((tag) => (
							<span key={tag} className='px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold'>
								{tag}
							</span>
						))}
					</div>

					{/* Description */}
					<div>
						<h4 className='mb-2'>Aprašymas</h4>
						<p className='text-sm text-muted-foreground leading-relaxed'>{fullDescription}</p>
					</div>

					{/* Schedule */}
					<div>
						<h4 className='mb-2'>Darbo laikas</h4>
						<div className='space-y-2 bg-muted/30 rounded-lg p-3'>
							{schedule.map((item, index) => (
								<div key={index} className='flex justify-between text-sm'>
									<span className='text-muted-foreground'>{item.day}</span>
									<span className='font-semibold'>{item.hours}</span>
								</div>
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className='flex gap-3 pt-2'>
						<button className='flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 font-semibold'>
							Pridėti į maršrutą
						</button>
						<button className='px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors'>
							<Heart className='w-5 h-5 text-muted-foreground hover:text-accent transition-colors' />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
