'use client';

import { Map, Eye, Heart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const user_id = 1;

export default function Home() {
	const router = useRouter();

	function openTripsPage() {
		router.push(`/trips?userId=${user_id}`);
	}

	function openSightsPage() {
		router.push(`/sights`);
	}

	function openInterestsPage() {
		router.push(`/interests`);
	}

	return (
		<main className='flex-1 pt-16'>
			<div className='max-w-5xl mx-auto px-6 py-16'>
				{/* Hero */}
				<div className='mb-14'>
					<h1 className="font-['Outfit'] text-3xl font-bold text-foreground mb-2">Sveiki atvykę 👋</h1>
					<p className='text-sm text-muted-foreground'>Pasirinkite, ką norėtumėte daryti šiandien.</p>
				</div>

				{/* Navigation cards */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					{/* Trips */}
					<button
						onClick={() => openTripsPage()}
						className='relative bg-card border border-border rounded-xl p-6 hover:border-border/60 hover:shadow-sm transition-all cursor-pointer overflow-hidden text-left group'
					>
						<div className='absolute top-0 left-0 right-0 h-0.5 bg-emerald-500' />

						<div className='mb-4 mt-1 w-10 h-10 rounded-lg bg-muted flex items-center justify-center'>
							<Map className='w-5 h-5 text-foreground/70' />
						</div>

						<h2 className="font-['Outfit'] font-semibold text-base text-foreground leading-snug mb-1">Mano kelionės</h2>
						<p className='text-xs text-muted-foreground leading-relaxed'>Peržiūrėk, kurk ir tvarkyk savo keliones</p>

						<div className='flex justify-end mt-4 pt-3 border-t border-border'>
							<ArrowRight className='w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all' />
						</div>
					</button>

					{/* Sights */}
					<button
						onClick={() => openSightsPage()}
						className='relative bg-card border border-border rounded-xl p-6 hover:border-border/60 hover:shadow-sm transition-all cursor-pointer overflow-hidden text-left group'
					>
						<div className='absolute top-0 left-0 right-0 h-0.5 bg-blue-500' />

						<div className='mb-4 mt-1 w-10 h-10 rounded-lg bg-muted flex items-center justify-center'>
							<Eye className='w-5 h-5 text-foreground/70' />
						</div>

						<h2 className="font-['Outfit'] font-semibold text-base text-foreground leading-snug mb-1">
							Lankytinos vietos
						</h2>
						<p className='text-xs text-muted-foreground leading-relaxed'>
							Naršyk lankytinas vietas ir pridėk jas prie kelionių
						</p>

						<div className='flex justify-end mt-4 pt-3 border-t border-border'>
							<ArrowRight className='w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all' />
						</div>
					</button>

					{/* Interests */}
					<button
						onClick={() => openInterestsPage()}
						className='relative bg-card border border-border rounded-xl p-6 hover:border-border/60 hover:shadow-sm transition-all cursor-pointer overflow-hidden text-left group'
					>
						<div className='absolute top-0 left-0 right-0 h-0.5 bg-rose-500' />

						<div className='mb-4 mt-1 w-10 h-10 rounded-lg bg-muted flex items-center justify-center'>
							<Heart className='w-5 h-5 text-foreground/70' />
						</div>

						<h2 className="font-['Outfit'] font-semibold text-base text-foreground leading-snug mb-1">
							Pomėgių anketa
						</h2>
						<p className='text-xs text-muted-foreground leading-relaxed'>
							Įvertink savo pomėgius
						</p>

						<div className='flex justify-end mt-4 pt-3 border-t border-border'>
							<ArrowRight className='w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all' />
						</div>
					</button>
				</div>
			</div>
		</main>
	);
}
