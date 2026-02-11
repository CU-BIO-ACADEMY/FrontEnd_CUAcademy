interface Stat {
    label: string;
    value: number | string;
    change: string;
    changeColor?: string;
}

interface ActivityStatsProps {
    stats: Stat[];
}

export function ActivityStats({ stats }: ActivityStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="text-sm font-medium text-gray-600 mb-2">{stat.label}</div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className={`text-sm mt-2 ${stat.changeColor || "text-green-600"}`}>{stat.change}</div>
                </div>
            ))}
        </div>
    );
}
