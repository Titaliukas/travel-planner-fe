'use client';

import { MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const user_id = 1;

export function Navbar() {
	const pathname = usePathname();
	const isAttractionsPage = pathname === '/';
	const isTripsPage = pathname.startsWith('/trip');

	return (
		<nav className='fixed top-0 left-0 right-0 z-50 bg-card border-b border-border'>
			<div className='px-6 h-16 flex items-center justify-between'>
				{/* Logo */}
				<Link href='/' className='flex items-center gap-2'>
					<MapPin className='w-6 h-6 text-primary' />
					<span className="font-['Outfit'] font-bold text-xl text-primary">KelionėsPlanas</span>
				</Link>

				{/* Navigation Links */}
				<div className='flex items-center gap-8'>
					<Link
						href='/'
						className={`font-['Outfit'] font-semibold transition-colors ${
							isAttractionsPage
								? 'text-primary border-b-2 border-primary pb-1'
								: 'text-foreground/70 hover:text-foreground'
						}`}
					>
						Pradžia
					</Link>
					<Link
						href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/openTripsPage?userId=${user_id}`}
						className={`font-['Outfit'] font-semibold transition-colors ${
							isTripsPage ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground/70 hover:text-foreground'
						}`}
					>
						Mano kelionės
					</Link>
				</div>

				{/* User Profile */}
				<div className='flex items-center gap-3'>
					<span className='text-sm text-foreground/70'>Laba diena, Mantai</span>
					<div className='w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center'>
						<User className='w-5 h-5 text-primary' />
					</div>
				</div>
			</div>
		</nav>
	);
}
