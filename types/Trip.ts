import User from '@/types/User';

export default interface Trip {
	Id: number;
	Name: string;
	Start: string | null;
	End: string | null;
	DayCount: number;
	IsPaused: boolean;
	IsCancelled: boolean;
	OwnerId: number;
	Owner?: User;
	Travelers?: User[];
}
