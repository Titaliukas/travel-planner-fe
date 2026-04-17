import Trip from '@/types/Trip';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AVATAR_COLORS = [
	'bg-blue-100 text-blue-700',
	'bg-rose-100 text-rose-700',
	'bg-emerald-100 text-emerald-700',
	'bg-amber-100 text-amber-700',
	'bg-purple-100 text-purple-700',
	'bg-sky-100 text-sky-700',
];

// Simplified Labels
const STATUS_LABELS = {
	ongoing: 'Vykdoma',
	done: 'Baigta',
	planning: 'Planuojama',
	paused: 'Sustabdyta',
	cancelled: 'Atšaukta',
};

// Simplified Badge Styles
const STATUS_BADGE = {
	ongoing: 'bg-accent text-white',
	done: 'bg-done text-white',
	planning: 'bg-accent/50 text-white',
	cancelled: 'bg-destructive text-white',
	paused: 'bg-warning/50 text-white',
};

// Simplified Top Bar Styles
const STATUS_BAR = {
	ongoing: 'bg-accent',
	done: 'bg-done',
	planning: 'bg-accent/50',
	cancelled: 'bg-destructive',
	paused: 'bg-warning/50',
};

// Logic: Returns status key only if a flag is true
function getTripStatus(trip: Trip) {
	if (trip.IsCancelled) return 'cancelled';
	if (trip.IsPaused) return 'paused';

	if (!trip.Start) return 'planning';
	if (!trip.End) return 'ongoing';

	return 'done';
}

function formatDate(dateStr: string | null): string | null {
	if (!dateStr) return null;
	return new Date(dateStr).toLocaleDateString('lt-LT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

function initials(name: string): string {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

export function TripCard({ trip }: { trip: Trip }) {
	const status = getTripStatus(trip);
	const startFmt = formatDate(trip.Start);
	const endFmt = formatDate(trip.End);
	const dateStr = startFmt && endFmt ? `${startFmt} – ${endFmt}` : startFmt ? `nuo ${startFmt}` : 'Data nenustatyta';

	const travelers = Array.isArray(trip.Travelers) ? trip.Travelers : [];
	const visibleTravelers = travelers.slice(0, 3);
	const extraCount = travelers.length - 3;

	const router = useRouter();

	function openTripPage() {
		router.push(`/trip?tripId=${trip.Id}`);
	}

	return (
		<button
			onClick={openTripPage}
			className='relative bg-card border border-border rounded-xl p-5 hover:border-border/60 hover:shadow-sm transition-all cursor-pointer overflow-hidden'
		>
			{/* Top accent bar */}
			{status && <div className={`absolute top-0 left-0 right-0 h-0.5 ${STATUS_BAR[status]}`} />}

			<div className='flex mt-2 mb-2'>
				<h3 className="font-['Outfit'] font-semibold text-base text-foreground leading-snug">{trip.Name}</h3>
			</div>

			{/* Badge */}
			{status && (
				<div className='flex mt-1'>
					<span
						className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[status]}`}
					>
						{STATUS_LABELS[status]}
					</span>
				</div>
			)}

			<div className='flex items-center gap-1.5 mt-3 text-xs text-muted-foreground'>
				<Calendar className='w-3 h-3 shrink-0' />
				<span>{dateStr}</span>
			</div>

			<div className='flex items-center justify-between mt-3 pt-3 border-t border-border'>
				<div className='flex items-baseline gap-1'>
					<span className='text-lg font-semibold text-foreground'>{trip.DayCount}</span>
					<span className='text-xs text-muted-foreground'>d.</span>
				</div>

				{travelers.length === 0 ? (
					<span className='text-xs text-muted-foreground'>Tik tu</span>
				) : (
					<div className='flex items-center'>
						{visibleTravelers.map((user, i) => (
							<div
								key={user.Id}
								title={user.Name}
								className={`w-7 h-7 rounded-full text-[10px] font-medium flex items-center justify-center border-2 border-card ${AVATAR_COLORS[i % AVATAR_COLORS.length]} ${i > 0 ? '-ml-2' : ''}`}
							>
								{initials(user.Name)}
							</div>
						))}
						{extraCount > 0 && (
							<div className='-ml-2 w-7 h-7 rounded-full text-[10px] font-medium flex items-center justify-center border-2 border-card bg-muted text-muted-foreground'>
								+{extraCount}
							</div>
						)}
					</div>
				)}
			</div>
		</button>
	);
}
