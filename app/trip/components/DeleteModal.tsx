'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface DeleteModalProps {
	tripId: string;
	userId: number;
	onClose: () => void;
}

export default function DeleteModal({ tripId, userId, onClose }: DeleteModalProps) {
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const backdropRef = useRef<HTMLDivElement>(null);

	const router = useRouter();

	async function handleDelete() {
		setSubmitting(true);
		setError(null);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/${tripId}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				const msg = await res.text();
				setError(msg || `Klaida: ${res.status}`);
				return;
			}

			// success → close modal (or redirect if you still want)
			router.push(`/trips?userId=${userId}`);
		} catch {
			setError('Nepavyko ištrinti kelionės');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div
			ref={backdropRef}
			onClick={(e) => e.target === backdropRef.current && onClose()}
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'
		>
			<div className='w-full max-w-md bg-card rounded-2xl border border-border shadow-xl'>
				{/* Header */}
				<div className='flex items-center justify-between px-6 py-4 border-b border-border'>
					<h2 className="font-['Outfit'] font-bold text-lg text-foreground">Ištrinti kelionę?</h2>
					<button
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors hover:cursor-pointer'
					>
						<X className='w-4 h-4' />
					</button>
				</div>

				{/* Body */}
				<div className='px-6 py-5'>
					<p className='text-sm text-muted-foreground'>
						Ar tikrai norite ištrinti šią kelionę? Šis veiksmas yra negrįžtamas.
					</p>

					{error && <p className='mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg'>{error}</p>}
				</div>

				{/* Footer */}
				<div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-border'>
					<button
						onClick={onClose}
						className='px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-lg hover:cursor-pointer'
					>
						Atšaukti
					</button>

					<button
						onClick={handleDelete}
						disabled={submitting}
						className='px-5 py-2 text-sm font-semibold bg-destructive text-white rounded-lg disabled:opacity-50 hover:bg-destructive/80 hover:cursor-pointer'
					>
						{submitting ? 'Trinama...' : 'Ištrinti'}
					</button>
				</div>
			</div>
		</div>
	);
}
