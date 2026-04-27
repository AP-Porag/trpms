import { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Sector,
} from "recharts";

const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
];

export default function DonutChart({ data, dataKey, nameKey, title }) {

    const [activeIndex, setActiveIndex] = useState(null);

    const total = data.reduce((sum, item) => sum + Number(item[dataKey]), 0);

    const currency = (val) => `$${Number(val || 0).toLocaleString()}`;

    // ================= ACTIVE SLICE (EXPAND EFFECT) =================
    const renderActiveShape = (props) => {
        const {
            cx, cy, innerRadius, outerRadius,
            startAngle, endAngle, fill,
        } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 8} // expand
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        );
    };

    // ================= CENTER DISPLAY =================
    const activeItem = activeIndex !== null ? data[activeIndex] : null;

    const centerLabel = activeItem
        ? activeItem[nameKey]
        : "Total";

    const centerValue = activeItem
        ? currency(activeItem[dataKey])
        : currency(total);

    const centerPercent = activeItem
        ? ((activeItem[dataKey] / total) * 100).toFixed(1) + "%"
        : "";

    const showLabels = data.length <= 6;

    return (
        <div className="space-y-4">

            <h3 className="text-sm font-semibold">{title}</h3>

            <div className="h-72 relative">

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>

                        <Pie
                            data={data}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={3}
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            isAnimationActive
                            label={
                                showLabels
                                    ? ({ percent }) =>
                                        `${(percent * 100).toFixed(0)}%`
                                    : false
                            }
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value, name) => {
                                const percent = ((value / total) * 100).toFixed(1);
                                return [
                                    `${currency(value)} (${percent}%)`,
                                    name,
                                ];
                            }}
                        />

                    </PieChart>
                </ResponsiveContainer>

                {/* ================= CENTER ================= */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <p className="text-sm text-muted-foreground">
                        {centerLabel}
                    </p>

                    <p className="text-xl font-bold">
                        {centerValue}
                    </p>

                    {activeItem && (
                        <p className="text-xs text-muted-foreground">
                            {centerPercent}
                        </p>
                    )}
                </div>

            </div>

            {/* ================= LEGEND ================= */}
            <div className="space-y-2 text-sm">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center hover:bg-muted/50 px-2 py-1 rounded transition"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ background: COLORS[index % COLORS.length] }}
                            />
                            <span>{item[nameKey]}</span>
                        </div>

                        <span className="font-medium">
                            {((item[dataKey] / total) * 100).toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}
