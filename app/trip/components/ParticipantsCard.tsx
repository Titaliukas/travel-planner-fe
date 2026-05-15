import User from '@/types/User';
interface ParticipantsCardProps {
	participants: User[];
}

export function ParticipantsCard({ participants }: ParticipantsCardProps) {
	console.log(participants);
	return (
		<div className='bg-card border border-border rounded-xl p-5'>
			<h4 className='mb-4'>Dalyviai</h4>

			{/* Avatar Circles */}
			<div className='flex -space-x-2 mb-4'>
				{participants.map((participant) => (
					<div
						key={participant.Id}
						className='w-10 h-10 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-primary font-semibold'
						title={participant.Username}
					>
						<span className='text-sm'>{participant.Username.charAt(0)}</span>
					</div>
				))}
			</div>

			{/* Participants List */}
			<div className='space-y-2 mb-4'>
				{participants.map((participant) => (
					<div key={participant.Id} className='flex items-center justify-between'>
						<span className='text-sm'>{participant.Username}</span>
						<span
							className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
								participant.Id === 1 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
							}`}
						>
							{participant.Id === 1 ? 'Kelionės planuotojas' : 'Keliautojas'}
						</span>
					</div>
				))}
			</div>

			{/* Add Participant */}
			{/* <button className='flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-semibold'>
				<UserPlus className='w-4 h-4' />
				<span>Pakviesti draugą</span>
			</button> */}
		</div>
	);
}
