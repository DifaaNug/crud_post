interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    color: string;
    description?: string;
}

export default function StatCard({ title, value, icon, color, description }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {description && (
                        <p className="text-sm text-gray-500 mt-1">
                            {description}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <span className="text-2xl">
                        {icon}
                    </span>
                </div>
            </div>
        </div>
    );
}
