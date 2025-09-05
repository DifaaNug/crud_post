<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardApiController extends Controller
{
    /**
     * Mendapatkan statistik umum dashboard.
     */
    public function stats(): JsonResponse
    {
        try {
            $totalProducts = Product::count();
            $totalPosts = Post::count();
            $publishedPosts = Post::where('status', 'published')->count();
            $draftPosts = Post::where('status', 'draft')->count();
            $lowStockProducts = Product::where('stock', '<', 10)->count();
            $outOfStockProducts = Product::where('stock', '=', 0)->count();
            $totalStockValue = Product::sum(DB::raw('price * stock'));

            return response()->json([
                'success' => true,
                'message' => 'Statistik dashboard berhasil diambil',
                'data' => [
                    'posts' => [
                        'total' => $totalPosts,
                        'published' => $publishedPosts,
                        'draft' => $draftPosts,
                        'published_percentage' => $totalPosts > 0 ? round(($publishedPosts / $totalPosts) * 100, 1) : 0
                    ],
                    'products' => [
                        'total' => $totalProducts,
                        'low_stock' => $lowStockProducts,
                        'out_of_stock' => $outOfStockProducts,
                        'total_stock_value' => $totalStockValue,
                        'avg_price' => $totalProducts > 0 ? round(Product::avg('price'), 2) : 0
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mendapatkan data chart untuk posts berdasarkan waktu.
     */
    public function postsChart(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', 'week'); // week, month, year
            $format = '%Y-%m-%d';
            $interval = '1 DAY';

            switch ($period) {
                case 'month':
                    $format = '%Y-%m-%d';
                    $interval = '1 DAY';
                    $startDate = Carbon::now()->subDays(30);
                    break;
                case 'year':
                    $format = '%Y-%m';
                    $interval = '1 MONTH';
                    $startDate = Carbon::now()->subMonths(12);
                    break;
                default: // week
                    $format = '%Y-%m-%d';
                    $interval = '1 DAY';
                    $startDate = Carbon::now()->subDays(7);
                    break;
            }

            $posts = Post::select(
                DB::raw("DATE_FORMAT(created_at, '{$format}') as date"),
                DB::raw('COUNT(*) as count'),
                'status'
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date', 'status')
            ->orderBy('date')
            ->get();

            // Format data untuk chart
            $chartData = [];
            $dates = [];
            
            // Generate all dates in range
            $current = $startDate->copy();
            while ($current <= Carbon::now()) {
                $dateKey = $current->format($period === 'year' ? 'Y-m' : 'Y-m-d');
                $dates[] = $dateKey;
                $chartData[$dateKey] = ['published' => 0, 'draft' => 0];
                
                if ($period === 'year') {
                    $current->addMonth();
                } else {
                    $current->addDay();
                }
            }

            // Fill with actual data
            foreach ($posts as $post) {
                if (isset($chartData[$post->date])) {
                    $chartData[$post->date][$post->status] = $post->count;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Data chart posts berhasil diambil',
                'data' => [
                    'period' => $period,
                    'dates' => $dates,
                    'chart_data' => $chartData
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data chart posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mendapatkan data chart untuk products berdasarkan kategori.
     */
    public function productsChart(): JsonResponse
    {
        try {
            $categoryStats = Product::select('category')
                ->selectRaw('COUNT(*) as count')
                ->selectRaw('SUM(stock) as total_stock')
                ->selectRaw('AVG(price) as avg_price')
                ->selectRaw('SUM(price * stock) as stock_value')
                ->groupBy('category')
                ->orderBy('count', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data chart products berhasil diambil',
                'data' => $categoryStats
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data chart products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mendapatkan data terbaru (recent activities).
     */
    public function recentActivities(): JsonResponse
    {
        try {
            $recentPosts = Post::select('id', 'title', 'status', 'created_at')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function($post) {
                    return [
                        'type' => 'post',
                        'id' => $post->id,
                        'title' => $post->title,
                        'status' => $post->status,
                        'created_at' => $post->created_at,
                        'action' => 'created'
                    ];
                });

            $recentProducts = Product::select('id', 'name', 'category', 'stock', 'created_at')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function($product) {
                    return [
                        'type' => 'product',
                        'id' => $product->id,
                        'title' => $product->name,
                        'status' => $product->stock > 0 ? 'in_stock' : 'out_of_stock',
                        'created_at' => $product->created_at,
                        'action' => 'created'
                    ];
                });

            $activities = $recentPosts->concat($recentProducts)
                ->sortByDesc('created_at')
                ->take(10)
                ->values();

            return response()->json([
                'success' => true,
                'message' => 'Data recent activities berhasil diambil',
                'data' => $activities
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data recent activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export data posts ke CSV format.
     */
    public function exportPosts(Request $request): JsonResponse
    {
        try {
            $query = Post::query();

            // Apply same filters as index method
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from') && !empty($request->date_from)) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            
            if ($request->has('date_to') && !empty($request->date_to)) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            $posts = $query->orderBy('created_at', 'desc')->get();

            // Generate CSV data
            $csvData = "ID,Title,Status,Created At,Updated At\n";
            foreach ($posts as $post) {
                $csvData .= sprintf(
                    '"%s","%s","%s","%s","%s"' . "\n",
                    $post->id,
                    str_replace('"', '""', $post->title),
                    $post->status,
                    $post->created_at->format('Y-m-d H:i:s'),
                    $post->updated_at->format('Y-m-d H:i:s')
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Data export posts berhasil digenerate',
                'data' => [
                    'filename' => 'posts_export_' . date('Y-m-d_H-i-s') . '.csv',
                    'content' => base64_encode($csvData),
                    'total_records' => $posts->count()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal export data posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
