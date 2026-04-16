import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Bell, Mail, MailOpen } from "lucide-react";

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
                <Bell className="w-5 h-5" />

                {unseenCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                        {unseenCount}
                    </span>
                )}
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border z-50">

                    {/* HEADER */}
                    <div className="p-3 border-b font-semibold text-sm">
                        Notifications ({unseenCount})
                    </div>

                    {/* LIST */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((n: any) => (
                            <div
                                key={n.id}
                                className={`flex items-start gap-3 p-3 border-b cursor-pointer hover:bg-gray-50 ${
                                    n.status === 0 ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => {
                                    if (n.route_name) {
                                        router.visit(route(n.route_name, n.route_param));
                                    }
                                }}
                            >
                                {/* ICON LETTER */}
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
                                    {n.icon_letter}
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{n.title}</p>
                                    <p className="text-xs text-gray-500">{n.description}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {new Date(n.created_at).toLocaleString()}
                                    </p>
                                </div>

                                {/* STATUS TOGGLE */}
                                <div
                                    className="flex items-center pl-2 border-l"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleStatus(n.id);
                                    }}
                                >
                                    {n.status === 0 ? (
                                        <Mail className="w-4 h-4 text-gray-600" />
                                    ) : (
                                        <MailOpen className="w-4 h-4 text-green-600" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
