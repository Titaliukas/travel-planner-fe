import { UserPlus } from 'lucide-react';

interface Participant {
	id: string;
	name: string;
	avatar?: string;
	role: 'organizer' | 'participant';
}

interface ParticipantsCardProps {
	participants: Participant[];
}

export function ParticipantsCard({ participants }: ParticipantsCardProps) {
	return (
		<div className='bg-card border border-border rounded-xl p-5'>
			<h4 className='mb-4'>Dalyviai</h4>

			{/* Avatar Circles */}
			<div className='flex -space-x-2 mb-4'>
				{participants.map((participant) => (
					<div
						key={participant.id}
						className='w-10 h-10 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-primary font-semibold'
						title={participant.name}
					>
						<span className='text-sm'>{participant.name.charAt(0)}</span>
					</div>
				))}
			</div>

			{/* Participants List */}
			<div className='space-y-2 mb-4'>
				{participants.map((participant) => (
					<div key={participant.id} className='flex items-center justify-between'>
						<span className='text-sm'>{participant.name}</span>
						<span
							className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
								participant.role === 'organizer' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
							}`}
						>
							{participant.role === 'organizer' ? 'Kelionės planuotojas' : 'Keliautojas'}
						</span>
					</div>
				))}
			</div>

			{/* Add Participant */}
			<button className='flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-semibold'>
				<UserPlus className='w-4 h-4' />
				<span>Pakviesti draugą</span>
			</button>
		</div>
	);
}
