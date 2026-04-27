import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RunRateGauge({ run_rate, summary }) {

    const currency = (val) =>
        `$${Number(val || 0).toLocaleString()}`;

    const percentage = summary.percentage; // already calculated

    // Limit to 120% max for UI
    const value = Math.min(percentage, 120);

    // ================= COLOR ZONES =================
    const data = [
        { name: "Behind", value: 80 },
        { name: "On Track", value: 20 },
        { name: "Ahead", value: 20 },
    ];

    const COLORS = [
        "#ef4444", // red
        "#f59e0b", // yellow
        "#22c55e", // green
    ];

    // ================= NEEDLE POSITION =================
    const needleData = [
        { value },
        { value: 120 - value },
    ];

    const getStatusLabel = () => {
        if (run_rate.status === "ahead") return "Ahead of Target";
        if (run_rate.status === "behind") return "Behind Target";
        return "On Track";
    };

    const getStatusColor = () => {
        if (run_rate.status === "ahead") return "text-green-600";
        if (run_rate.status === "behind") return "text-red-600";
        return "text-yellow-600";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Progress (Goal Tracking)</CardTitle>
                <p className="text-xs text-muted-foreground">
                    Based on today’s date, this shows how much revenue you should have earned by now versus what you’ve actually earned.
                </p>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* ================= GAUGE ================= */}
                <div className="h-64 relative">

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>

                            {/* Background zones */}
                            <Pie
                                data={data}
                                startAngle={180}
                                endAngle={0}
                                innerRadius={80}
                                outerRadius={100}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>

                            {/* Needle */}
                            <Pie
                                data={needleData}
                                startAngle={180}
                                endAngle={0}
                                innerRadius={0}
                                outerRadius={80}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell fill="#111827" /> {/* needle */}
                                <Cell fill="transparent" />
                            </Pie>

                        </PieChart>
                    </ResponsiveContainer>

                    {/* CENTER TEXT */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold">
                            {percentage.toFixed(0)}%
                        </p>
                        <p className={`text-sm font-semibold ${getStatusColor()}`}>
                            {getStatusLabel()}
                        </p>
                    </div>
                </div>

                {/* ================= VALUES ================= */}
                <div className="flex justify-between text-sm">
                    <span>Expected: {currency(run_rate.expected)}</span>
                    <span>Actual: {currency(run_rate.actual)}</span>
                </div>

                {/* ================= DIFFERENCE ================= */}
                <div className="text-center">
                    <p className={`text-sm font-semibold ${getStatusColor()}`}>
                        {run_rate.status === "ahead"
                            ? `Ahead by ${currency(run_rate.difference)}`
                            : run_rate.status === "behind"
                                ? `Behind by ${currency(Math.abs(run_rate.difference))}`
                                : "On Track"}
                    </p>
                </div>

            </CardContent>
        </Card>
    );
}
