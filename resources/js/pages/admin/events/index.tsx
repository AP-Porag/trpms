import { useEffect, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type EventItem = {
    id: number;
    title: string;
    start: string;
    color: string;
    status: string;
    entity_type: string;
    entity_id: number;
    description?: string;
};

type PageProps = {
    events: EventItem[];
    filters: {
        view: string;
        date: string;
    };
};

const breadcrumbs = [{ title: "Business Timeline", href: "/events" }];

export default function Index() {
    const { events, filters } = usePage<PageProps>().props;

    function mapBackendView(v: string) {
        if (v === "month") return "dayGridMonth";
        if (v === "week") return "timeGridWeek";
        if (v === "day") return "timeGridDay";
        return "agenda";
    }

    const [view, setView] = useState<string>(
        mapBackendView(filters.view || "month")
    );
    const [date, setDate] = useState<string>(filters.date);

    // ================= AUTO REFRESH =================
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["events"],
                preserveState: true,
                preserveScroll: true,
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const mapView = (v: string) => {
        if (v === "dayGridMonth") return "month";
        if (v === "timeGridWeek") return "week";
        if (v === "timeGridDay") return "day";
        return "agenda";
    };

    const handleEventClick = (info: any) => {
        const { entity_type, entity_id } = info.event.extendedProps;

        let url = "#";

        if (entity_type === "job") url = `/jobs/${entity_id}`;
        if (entity_type === "job_candidate") url = `/job-candidates/${entity_id}`;
        if (entity_type === "placement") url = `/placements/${entity_id}`;
        if (entity_type === "invoice") url = `/invoices/${entity_id}`;
        if (entity_type === "agreement") url = `/agreements/${entity_id}`;

        window.location.href = url;
    };

    // ================= EVENT UI =================
    const renderEvent = (info: any) => {
        const { status } = info.event.extendedProps;

        return (
            <div
                title={info.event.extendedProps.description || ""}
                className="text-[11px] px-1.5 py-[2px] rounded-md cursor-pointer"
                style={{
                    backgroundColor: info.event.backgroundColor,
                    color: "#fff",
                    marginBottom: "3px",
                    textDecoration: status === "completed" ? "line-through" : "none",
                    opacity: status === "completed" ? 0.7 : 1,
                }}
            >
                {info.event.title}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business Timeline" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-background space-y-5 rounded-xl border p-5">
                    {/* HEADER */}
                    <div>
                        <h2 className="text-lg font-semibold">Business Timeline</h2>
                        <p className="text-muted-foreground text-xs">
                            Automatically generated timeline of interviews, offers, placements, invoices, agreements, and job activity. Updated hourly
                            and refreshed in the interface to keep your business view always current.
                        </p>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* DATE */}
                        <div></div>
                        <input
                            type="date"
                            hidden={true}
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                router.get(
                                    route('events.index'),
                                    {
                                        view: mapView(view),
                                        date: e.target.value,
                                    },
                                    { preserveState: true },
                                );
                            }}
                            className="rounded-md border px-2 py-1 text-sm"
                        />

                        {/* VIEW SELECT */}
                        <Select value={view} onValueChange={(v) => setView(v)}>
                            <SelectTrigger className="h-8 w-[140px] text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dayGridMonth">Month</SelectItem>
                                <SelectItem value="timeGridWeek">Week</SelectItem>
                                <SelectItem value="timeGridDay">Day</SelectItem>
                                <SelectItem value="agenda">Agenda</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* CALENDAR */}
                    {view !== 'agenda' ? (
                        <FullCalendar
                            key={view}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView={view}
                            events={events}
                            eventClick={handleEventClick}
                            eventContent={renderEvent}
                            height="auto"
                        />
                    ) : (
                        <AgendaView events={events} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

/* ================= AGENDA ================= */

function AgendaView({ events }: { events: EventItem[] }) {
    const grouped = groupByDate(events);

    return (
        <div className="space-y-6">
            {Object.keys(grouped).map((date) => (
                <div key={date}>
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                        {date}
                    </h3>

                    <div className="space-y-2">
                        {grouped[date].map((event) => (
                            <div
                                key={event.id}
                                className="p-3 rounded-lg border cursor-pointer"
                                style={{ backgroundColor: event.color + "20" }}
                                onClick={() =>
                                    (window.location.href = `/${event.entity_type}/${event.entity_id}`)
                                }
                            >
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                        {event.title}
                                    </span>

                                    <span
                                        className={`text-xs px-2 py-1 rounded ${
                                            event.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {event.status}
                                    </span>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    {event.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ================= HELPER ================= */

function groupByDate(events: EventItem[]) {
    return events.reduce<Record<string, EventItem[]>>((acc, event) => {
        const date = event.start.split("T")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {});
}
