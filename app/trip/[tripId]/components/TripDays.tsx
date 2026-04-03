'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';

interface DayPlace {
	id: string;
	name: string;
	time: string;
	duration: string;
}

interface TripDay {
	day: number;
	date: string;
	places: DayPlace[];
	totalDuration: string;
}

interface TripDaysProps {
	days: TripDay[];
}

export function TripDays({ days }: TripDaysProps) {
	const [expandedDays, setExpandedDays] = useState<number[]>([1]);

	const toggleDay = (day: number) => {
		setExpandedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
	};

	return (
		<div className='bg-card border border-border rounded-xl p-6'>
			<h3 className='mb-4'>Kelionės dienos</h3>

			<div className='space-y-3'>
				{days.map((day) => {
					const isExpanded = expandedDays.includes(day.day);

					return (
						<div key={day.day} className='border border-border rounded-lg overflow-hidden'>
							{/* Day Header */}
							<button
								onClick={() => toggleDay(day.day)}
								className='w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left'
							>
								<div>
									<h4 className='mb-1'>{day.day} Diena</h4>
									<p className='text-sm text-muted-foreground'>
										{day.places.length} vietos · {day.totalDuration}
									</p>
								</div>
								{isExpanded ? (
									<ChevronUp className='w-5 h-5 text-muted-foreground' />
								) : (
									<ChevronDown className='w-5 h-5 text-muted-foreground' />
								)}
							</button>

							{/* Day Content */}
							{isExpanded && (
								<div className='px-4 pb-4 border-t border-border'>
									<div className='mt-4 space-y-3'>
										{day.places.map((place, index) => (
											<div key={place.id} className='flex gap-3'>
												{/* Timeline */}
												<div className='flex flex-col items-center'>
													<div className='w-3 h-3 rounded-full bg-primary flex-shrink-0 mt-1.5' />
													{index < day.places.length - 1 && (
														<div className='w-0.5 h-full bg-primary/30 my-1 flex-1 min-h-[40px]' />
													)}
												</div>

												{/* Place Info */}
												<div className='flex-1 pb-3'>
													<div className='flex items-center gap-2 mb-1'>
														<span className='text-xs font-semibold text-primary'>{place.time}</span>
														<h4 className='text-sm'>{place.name}</h4>
													</div>
													<div className='flex items-center gap-1 text-xs text-muted-foreground'>
														<Clock className='w-3 h-3' />
														<span>{place.duration}</span>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
