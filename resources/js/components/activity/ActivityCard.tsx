import { ArrowLeft } from 'lucide-react';
import { ACTIVITY_EVENT_CONFIG } from './activityConfig';
import ActivityDetails from '@/components/activity/ActivityDetails.jsx';

export default function ActivityCard({ activity, showArrow }) {
    const config = ACTIVITY_EVENT_CONFIG[activity.event];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className="flex items-start gap-4">
            {/* Arrow */}
            {showArrow && <ArrowLeft className="text-muted-foreground mt-6 h-4 w-4 shrink-0" />}

            {/* Card */}
            <div className={`min-w-[260px] rounded-lg border p-4 shadow-sm ${config.color}`}>
                {/* Header */}
                <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{config.label}</span>
                </div>

                {/* Main content */}
                <ActivityDetails activity={activity} />

                {/* Footer */}
                <div className="text-muted-foreground mt-3 text-xs">{new Date(activity.created_at).toLocaleTimeString()}</div>
            </div>
        </div>
    );
}
