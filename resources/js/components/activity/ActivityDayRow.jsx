import ActivityCard from './ActivityCard';
import { formatDateUS } from '@/utils/helpers';

export default function ActivityDayRow({ date, items, isLast }) {
    return (
        <div className="relative pl-8 pb-8">
            {/* Vertical timeline line */}
            {!isLast && (
                <div className="absolute left-3 top-6 h-full w-px bg-border" />
            )}

            {/* Date marker */}
            <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-background border flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
            </div>

            {/* Date label */}
            <div className="mb-4 text-sm font-semibold">
                {formatDateUS(date)}
            </div>

            {/* Timeline cards */}
            <div className="flex gap-6 items-start">
                {items.map((item, index) => (
                    <ActivityCard
                        key={item.id}
                        activity={item}
                        showArrow={index !== 0}
                    />
                ))}
            </div>
        </div>
    );
}
