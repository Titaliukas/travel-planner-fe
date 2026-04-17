export function SkeletonCard() {
	return (
		<div className='bg-card border border-border rounded-xl p-5 animate-pulse'>
			<div className='h-4 bg-muted rounded w-3/4 mb-3 mt-2' />
			<div className='h-3 bg-muted rounded w-1/3 mb-3' />
			<div className='h-3 bg-muted rounded w-1/2' />
			<div className='mt-4 pt-3 border-t border-border flex justify-between'>
				<div className='h-5 bg-muted rounded w-10' />
				<div className='h-5 bg-muted rounded w-16' />
			</div>
		</div>
	);
}
