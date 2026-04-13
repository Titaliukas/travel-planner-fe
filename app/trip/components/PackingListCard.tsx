'use client';

import { Checkbox } from '@/components/ui/CheckBox';
import { Download } from 'lucide-react';
import { useState } from 'react';

interface PackingItem {
	id: string;
	name: string;
	category: string;
}

const defaultItems: PackingItem[] = [
	{ id: '1', name: 'Marškinėliai', category: 'Drabužiai' },
	{ id: '2', name: 'Kelnės', category: 'Drabužiai' },
	{ id: '3', name: 'Sportbačiai', category: 'Drabužiai' },
	{ id: '4', name: 'Pasas', category: 'Dokumentai' },
	{ id: '5', name: 'Bilietas', category: 'Dokumentai' },
	{
		id: '6',
		name: 'Telefono įkroviklis',
		category: 'Elektronika',
	},
	{ id: '7', name: 'Fotoaparatas', category: 'Elektronika' },
];

export function PackingListCard() {
	const [checkedItems, setCheckedItems] = useState<string[]>([]);

	const toggleItem = (id: string) => {
		setCheckedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
	};

	const categories = Array.from(new Set(defaultItems.map((item) => item.category)));

	return (
		<div className='bg-card border border-border rounded-xl p-5'>
			<h4 className='mb-4'>Rekomenduojami daiktai</h4>

			{/* Packing List by Category */}
			<div className='space-y-4 mb-4'>
				{categories.map((category) => (
					<div key={category}>
						<h5 className='text-sm font-semibold text-muted-foreground mb-2'>{category}</h5>
						<div className='space-y-2'>
							{defaultItems
								.filter((item) => item.category === category)
								.map((item) => (
									<div key={item.id} className='flex items-center gap-2'>
										<Checkbox
											id={item.id}
											checked={checkedItems.includes(item.id)}
											onCheckedChange={() => toggleItem(item.id)}
											className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
										/>
										<label
											htmlFor={item.id}
											className={`text-sm cursor-pointer font-normal flex-1 ${
												checkedItems.includes(item.id) ? 'line-through text-muted-foreground' : ''
											}`}
										>
											{item.name}
										</label>
									</div>
								))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
