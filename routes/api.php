<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostApiController;
use App\Http\Controllers\Api\ProductApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Di sini Anda dapat mendaftarkan routes API untuk aplikasi Anda.
| Routes ini akan dimuat oleh RouteServiceProvider dalam grup yang
| sudah ditetapkan dengan middleware "api".
|
*/

// Route untuk mendapatkan informasi user yang sedang login
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API Routes untuk Posts
Route::prefix('posts')->group(function () {
    Route::get('/', [PostApiController::class, 'index']);           // GET /api/posts - Ambil semua posts
    Route::post('/', [PostApiController::class, 'store']);          // POST /api/posts - Buat post baru
    Route::get('/{id}', [PostApiController::class, 'show']);        // GET /api/posts/{id} - Ambil detail post
    Route::put('/{id}', [PostApiController::class, 'update']);      // PUT /api/posts/{id} - Update post
    Route::delete('/{id}', [PostApiController::class, 'destroy']);  // DELETE /api/posts/{id} - Hapus post
});

// API Routes untuk Products
Route::prefix('products')->group(function () {
    Route::get('/', [ProductApiController::class, 'index']);           // GET /api/products - Ambil semua products
    Route::post('/', [ProductApiController::class, 'store']);          // POST /api/products - Buat product baru
    Route::get('/{id}', [ProductApiController::class, 'show']);        // GET /api/products/{id} - Ambil detail product
    Route::put('/{id}', [ProductApiController::class, 'update']);      // PUT /api/products/{id} - Update product
    Route::delete('/{id}', [ProductApiController::class, 'destroy']);  // DELETE /api/products/{id} - Hapus product
});

// Route untuk mendapatkan statistik dashboard
Route::get('/dashboard/stats', function () {
    $totalProducts = \App\Models\Product::count();
    $totalPosts = \App\Models\Post::count();
    $publishedPosts = \App\Models\Post::where('status', 'published')->count();
    $lowStockProducts = \App\Models\Product::where('stock', '<', 10)->count();

    return response()->json([
        'success' => true,
        'message' => 'Statistik dashboard berhasil diambil',
        'data' => [
            'total_products' => $totalProducts,
            'total_posts' => $totalPosts,
            'published_posts' => $publishedPosts,
            'low_stock_products' => $lowStockProducts
        ]
    ]);
});
