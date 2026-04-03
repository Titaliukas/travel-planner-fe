interface TabNavigationProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
	const tabs = [
		{ id: 'overview', label: 'Apžvalga' },
		{ id: 'route', label: 'Maršrutas' },
		{ id: 'participants', label: 'Dalyviai' },
		{ id: 'accommodation', label: 'Apgyvendinimas' },
		{ id: 'packing', label: 'Daiktų sąrašas' },
	];

	return (
		<div className='border-b border-border'>
			<div className='flex gap-8'>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`pb-3 relative transition-colors ${
							activeTab === tab.id ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
						}`}
					>
						{tab.label}
						{activeTab === tab.id && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full' />}
					</button>
				))}
			</div>
		</div>
	);
}
