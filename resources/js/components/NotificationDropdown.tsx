import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Bell, Mail, MailOpen } from "lucide-react";
import { Separator } from '@/components/ui/separator';

export default function NotificationDropdown() {
    const { notifications: initialNotifications, notification_unseen_count } = usePage().props as any;

    const [notifications, setNotifications] = useState(initialNotifications || []);
    const [unseenCount, setUnseenCount] = useState(notification_unseen_count || 0);
    const [open, setOpen] = useState(false);

    // 🔁 AUTO REFRESH (every 30s)
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['notifications', 'notification_unseen_count'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setNotifications(initialNotifications);
        setUnseenCount(notification_unseen_count);
    }, [initialNotifications, notification_unseen_count]);

    const toggleStatus = (id: number) => {
        router.post(route('notifications.toggle', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({
                    only: ['notifications', 'notification_unseen_count']
                });
            }
        });
    };

    return (
        <div className="relative">
            {/* 🔔 Bell Icon */}
            <button onClick={() => setOpen(!open)} className="relative">
                <Bell className="h-5 w-5" />

                {unseenCount > 0 && <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs text-white">{unseenCount}</span>}
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute right-0 z-50 mt-2 w-96 rounded-lg border bg-white shadow-lg">
                    {/* HEADER */}
                    <div className="border-b p-3 text-sm font-semibold">Notifications ({unseenCount})</div>

                    {/* LIST */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((n: any) => (
                                <div
                                    key={n.id}
                                    className={`flex cursor-pointer items-start gap-3 border-b p-3 hover:bg-gray-50 ${
                                        n.status === 0 ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => {
                                        if (n.route_name) {
                                            router.visit(route(n.route_name, n.route_param));
                                        }
                                    }}
                                >
                                    {/* ICON LETTER */}
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
                                        {n.icon_letter}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{n.title}</p>
                                        <p className="text-xs text-gray-500">{n.description}</p>
                                        <p className="mt-1 text-[10px] text-gray-400">{new Date(n.created_at).toLocaleString()}</p>
                                    </div>

                                    <Separator orientation="vertical" style={{ height: '70px' }} />

                                    {/* STATUS TOGGLE */}
                                    <div
                                        className="flex items-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStatus(n.id);
                                        }}
                                    >
                                        {n.status === 0 ? (
                                            <Mail className="h-4 w-4 text-gray-600" />
                                        ) : (
                                            <MailOpen className="h-4 w-4 text-green-600" />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-center text-sm text-gray-500">No notifications yet!</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
