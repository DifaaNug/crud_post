<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Menampilkan halaman dashboard dengan data analytics.
     */
    public function index()
    {
        // Total statistik
        $totalProducts = Product::count();
        $totalPosts = Post::count();
        $publishedPosts = Post::where('status', 'published')->count();
        $lowStockProducts = Product::where('stock', '<', 10)->count();

        // Distribusi kategori produk
        $categoryDistribution = Product::select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get()
            ->toArray();

        // Analisis stok produk
        $stockAnalysis = [
            ['range' => 'Habis (0)', 'count' => Product::where('stock', 0)->count()],
            ['range' => 'Rendah (1-10)', 'count' => Product::whereBetween('stock', [1, 10])->count()],
            ['range' => 'Normal (11-50)', 'count' => Product::whereBetween('stock', [11, 50])->count()],
            ['range' => 'Tinggi (>50)', 'count' => Product::where('stock', '>', 50)->count()],
        ];

        // Data trend bulanan (6 bulan terakhir)
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyData[] = [
                'month' => $date->format('M Y'),
                'products' => Product::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'posts' => Post::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        }

        // Data recent items (5 item terbaru)
        $recentProducts = Product::orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'name', 'price', 'stock', 'image', 'created_at']);

        $recentPosts = Post::orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'title', 'content', 'status', 'created_at']);

        return Inertia::render('dashboard', [
            'analytics' => [
                'totalProducts' => $totalProducts,
                'totalPosts' => $totalPosts,
                'publishedPosts' => $publishedPosts,
                'lowStockProducts' => $lowStockProducts,
                'categoryDistribution' => $categoryDistribution,
                'stockAnalysis' => $stockAnalysis,
                'monthlyData' => $monthlyData,
                'recentProducts' => $recentProducts,
                'recentPosts' => $recentPosts,
            ]
        ]);
    }
}
