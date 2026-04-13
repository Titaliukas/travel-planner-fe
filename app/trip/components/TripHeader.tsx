import { MapPin, Users, Hotel, Edit, UserPlus, Route } from 'lucide-react';

interface TripHeaderProps {
	title: string;
	status: string;
	//dateRange: string;
	placesCount: number;
	participants: number;
	hasAccommodation: boolean;
	onUpdate: () => void;
}

const statusStyles: Record<string, string> = {
	Vykdoma: 'bg-accent text-white',
	Baigta: 'bg-done text-white',
	Planuojama: 'bg-accent/50 text-white',
	Atšaukta: 'bg-destructive text-white',
	Sustabdyta: 'bg-warning/50 text-white',
};

export function TripHeader({ title, status, placesCount, participants, hasAccommodation, onUpdate }: TripHeaderProps) {
	return (
		<div className='bg-linear-to-r from-[#1A6B3C] to-[#2D8A55] rounded-xl p-8 text-white shadow-lg shadow-primary/20'>
			{/* Title and Status */}
			<div className='flex items-start justify-between mb-6'>
				<div>
					<h1 className='text-white mb-3'>{title}</h1>
					<span
						className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[status]}`}
					>
						{status}
					</span>
				</div>
			</div>

			{/* Trip Stats */}
			<div className='flex items-center gap-6 mb-6 flex-wrap'>
				<div className='flex items-center gap-2'>
					<MapPin className='w-5 h-5 text-white/90' />
					<span className='text-white/90'>{placesCount} lankytinos vietos</span>
				</div>
				<div className='flex items-center gap-2'>
					<Users className='w-5 h-5 text-white/90' />
					<span className='text-white/90'>{participants} dalyviai</span>
				</div>
				{hasAccommodation && (
					<div className='flex items-center gap-2'>
						<Hotel className='w-5 h-5 text-white/90' />
						<span className='text-white/90'>Viešbutis pasirinktas</span>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className='flex items-center gap-3'>
				<button
					onClick={onUpdate}
					className='flex items-center gap-2 px-4 py-2 border-2 border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors'
				>
					<Edit className='w-4 h-4' />
					<span>Redaguoti</span>
				</button>
				<button className='flex items-center gap-2 px-4 py-2 border-2 border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors'>
					<UserPlus className='w-4 h-4' />
					<span>Pridėti dalyvį</span>
				</button>
				<button className='flex items-center gap-2 px-5 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors font-semibold shadow-lg ml-auto'>
					<Route className='w-4 h-4' />
					<span>Generuoti maršrutą</span>
				</button>
			</div>
		</div>
	);
}
