export function SightSkeletonCard() {
	return (
		<div className='border border-border rounded-xl bg-card overflow-hidden'>
			<div className='px-5 py-4 flex items-center justify-between'>
				<div className='flex-1'>
					<div className='flex items-center gap-3 mb-2'>
						<div className='h-4 w-36 bg-muted rounded-md animate-pulse' />
					</div>
					<div className='flex items-center gap-4'>
						<div className='h-3 w-24 bg-muted rounded-md animate-pulse' />
						<div className='h-3 w-12 bg-muted rounded-md animate-pulse' />
					</div>
				</div>
				<div className='ml-4 w-5 h-5 bg-muted rounded animate-pulse' />
			</div>
		</div>
	);
}
