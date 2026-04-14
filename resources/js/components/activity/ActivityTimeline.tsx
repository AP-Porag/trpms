import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ActivityDayRow from './ActivityDayRow';

export default function ActivityTimeline({ subjectType, subjectId }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        setLoading(true);

        fetch(
            route('activity.logs.for-subject', {
                subject_type: subjectType,
                subject_id: subjectId,
            }),
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (isMounted) {
                    setActivities(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [subjectType, subjectId]);

    if (loading) {
        return (
            <div className="text-sm text-muted-foreground">
                Loading activity…
            </div>
        );
    }

    if (!activities.length) {
        return (
            <div className="text-sm text-muted-foreground">
                No activity yet.
            </div>
        );
    }

    // Group by date
    const grouped = activities.reduce((acc, item) => {
        const date = item.created_at.split('T')[0];
        acc[date] = acc[date] || [];
        acc[date].push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([date, items], index, arr) => (
                <ActivityDayRow key={date} date={date} items={items} isLast={index === arr.length - 1} />
            ))}
        </div>
    );
}
