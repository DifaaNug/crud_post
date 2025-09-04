import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import StatCard from '@/components/StatCard';
import { BarChart, PieChart, LineChart } from '@/components/Charts';
import RecentItems from '@/components/RecentItems';
import ExportButton from '@/components/ExportButton';
import { exportPosts, exportProducts } from '@/utils/exportHelpers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardData {
    totalProducts: number;
    totalPosts: number;
    publishedPosts: number;
    lowStockProducts: number;
    categoryDistribution: Array<{ category: string; count: number }>;
    stockAnalysis: Array<{ range: string; count: number }>;
    monthlyData: Array<{ month: string; products: number; posts: number }>;
    recentProducts: Array<{
        id: number;
        name: string;
        price: number;
        stock: number;
        image?: string;
        created_at: string;
    }>;
    recentPosts: Array<{
        id: number;
        title: string;
        content: string;
        status: string;
        created_at: string;
    }>;
}

interface DashboardProps {
    analytics: DashboardData;
}

export default function Dashboard({ analytics }: DashboardProps) {
    // Data untuk chart
    const categoryChartData = {
        labels: analytics.categoryDistribution.map(item => item.category),
        datasets: [{
            label: 'Jumlah Produk per Kategori',
            data: analytics.categoryDistribution.map(item => item.count),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)',
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(139, 92, 246, 1)',
                'rgba(236, 72, 153, 1)',
            ],
            borderWidth: 1,
        }]
    };

    const stockChartData = {
        labels: analytics.stockAnalysis.map(item => item.range),
        datasets: [{
            label: 'Distribusi Stok Produk',
            data: analytics.stockAnalysis.map(item => item.count),
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',   // Habis - Merah
                'rgba(245, 158, 11, 0.8)',  // Rendah - Kuning
                'rgba(16, 185, 129, 0.8)',  // Normal - Hijau
                'rgba(59, 130, 246, 0.8)',  // Tinggi - Biru
            ],
            borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(59, 130, 246, 1)',
            ],
            borderWidth: 1,
        }]
    };

    const monthlyChartData = {
        labels: analytics.monthlyData.map(item => item.month),
        datasets: [
            {
                label: 'Produk Ditambahkan',
                data: analytics.monthlyData.map(item => item.products),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Post Dibuat',
                data: analytics.monthlyData.map(item => item.posts),
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
            }
        ]
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Analytics" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Ringkasan data dan statistik aplikasi Anda
                    </p>
                    
                    {/* Export Actions */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        <ExportButton
                            label="📝 Export Posts"
                            onExport={async () => {
                                await exportPosts();
                            }}
                            variant="outline"
                        />
                        <ExportButton
                            label="📦 Export Products"
                            onExport={async () => {
                                await exportProducts();
                            }}
                            variant="outline"
                        />
                    </div>
                </div>

                {/* Statistik Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Produk"
                        value={analytics.totalProducts}
                        icon="📦"
                        color="blue"
                    />
                    <StatCard
                        title="Total Post"
                        value={analytics.totalPosts}
                        icon="📝"
                        color="green"
                    />
                    <StatCard
                        title="Post Dipublikasi"
                        value={analytics.publishedPosts}
                        icon="✅"
                        color="purple"
                    />
                    <StatCard
                        title="Stok Rendah"
                        value={analytics.lowStockProducts}
                        icon="⚠️"
                        color="red"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Bar Chart - Kategori Produk */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Produk per Kategori
                        </h3>
                        <BarChart data={categoryChartData} />
                    </div>

                    {/* Pie Chart - Distribusi Stok */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Distribusi Stok
                        </h3>
                        <PieChart data={stockChartData} />
                    </div>

                    {/* Line Chart - Trend Bulanan */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2 xl:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Trend Bulanan
                        </h3>
                        <LineChart data={monthlyChartData} />
                    </div>
                </div>

                {/* Recent Items Section */}
                <RecentItems
                    recentProducts={analytics.recentProducts}
                    recentPosts={analytics.recentPosts}
                />
            </div>
        </AppLayout>
    );
}
