import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
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

    const total = data.reduce((sum, item) => sum + Number(item[dataKey]), 0);

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
                            isAnimationActive
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                    className="hover:opacity-80 transition"
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value, name) => [
                                `$${Number(value).toLocaleString()}`,
                                name,
                            ]}
                        />

                    </PieChart>
                </ResponsiveContainer>

                {/* CENTER VALUE */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-xl font-bold">
                        ${total.toLocaleString()}
                    </p>
                </div>

            </div>

            {/* LEGEND */}
            <div className="space-y-2 text-sm">
                {data.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
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
