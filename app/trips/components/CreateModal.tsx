'use client';

import { X } from 'lucide-react';
import { useRef, useState } from 'react';

interface TripForm {
	Name: string;
}

interface CreateModalProps {
	userId: string;
	onClose: () => void;
	onCreated: () => void;
}

export function CreateModal({ userId, onClose, onCreated }: CreateModalProps) {
	const [form, setForm] = useState<TripForm>({ Name: '' });
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const backdropRef = useRef<HTMLDivElement>(null);

	function setField<K extends keyof TripForm>(field: K, value: TripForm[K]) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	async function submit() {
		setSubmitting(true);
		setError(null);
		try {
			const body = {
				...form,
				OwnerId: Number(userId),
			};
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/user/${userId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
				redirect: 'manual',
				cache: 'no-store',
			});

			console.log(res);

			if (res.ok) {
				onCreated();
				return;
			}

			const msg = await res.text();
			setError(msg || `Klaida: ${res.status}`);
		} catch {
			window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/openTripsPage?userId=${userId}`;
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
				<div className='flex items-center justify-between px-6 py-4 border-b border-border'>
					<h2 className="font-['Outfit'] font-bold text-lg text-foreground">Nauja kelionė</h2>
					<button
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors'
					>
						<X className='w-4 h-4' />
					</button>
				</div>
				<div className='px-6 py-5 flex flex-col gap-4'>
					<div>
						<label className='block text-sm font-semibold text-foreground mb-1'>Pavadinimas</label>
						<input
							className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30'
							value={form.Name}
							onChange={(e) => setField('Name', e.target.value)}
						/>
					</div>
					{error && <p className='text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg'>{error}</p>}
				</div>
				<div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-border'>
					<button
						onClick={onClose}
						className='px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-lg'
					>
						Atšaukti
					</button>
					<button
						onClick={submit}
						disabled={submitting}
						className='px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg disabled:opacity-50'
					>
						{submitting ? 'Kuriama...' : 'Sukurti'}
					</button>
				</div>
			</div>
		</div>
	);
}
