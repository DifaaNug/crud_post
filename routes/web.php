<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
});


//Mendaftarkan Route Halaman Web
Route::resource('posts', \App\Http\Controllers\PostController::class)->middleware(['auth']);

// Route untuk Products CRUD
Route::resource('products', \App\Http\Controllers\ProductController::class)->middleware(['auth']);

// Route untuk export users (harus sebelum resource route)
Route::get('users/export/csv', [\App\Http\Controllers\UserController::class, 'export'])
    ->name('users.export')
    ->middleware(['auth']);

// Route untuk Users Management
Route::resource('users', \App\Http\Controllers\UserController::class)->middleware(['auth']);

// Archive Management Routes
Route::middleware(['auth'])->group(function () {
    // Main archive page
    Route::get('archive', [\App\Http\Controllers\ArchiveController::class, 'index'])->name('archive.index');

    // Archive operations (soft delete)
    Route::delete('archive/posts/{post}', [\App\Http\Controllers\ArchiveController::class, 'archivePost'])->name('archive.posts');
    Route::delete('archive/products/{product}', [\App\Http\Controllers\ArchiveController::class, 'archiveProduct'])->name('archive.products');
    Route::delete('archive/users/{user}', [\App\Http\Controllers\ArchiveController::class, 'archiveUser'])->name('archive.users');

    // Restore operations
    Route::patch('archive/posts/{id}/restore', [\App\Http\Controllers\ArchiveController::class, 'restorePost'])->name('archive.posts.restore');
    Route::patch('archive/products/{id}/restore', [\App\Http\Controllers\ArchiveController::class, 'restoreProduct'])->name('archive.products.restore');
    Route::patch('archive/users/{id}/restore', [\App\Http\Controllers\ArchiveController::class, 'restoreUser'])->name('archive.users.restore');

    // Permanent delete operations
    Route::delete('archive/posts/{id}/force', [\App\Http\Controllers\ArchiveController::class, 'forceDeletePost'])->name('archive.posts.force');
    Route::delete('archive/products/{id}/force', [\App\Http\Controllers\ArchiveController::class, 'forceDeleteProduct'])->name('archive.products.force');
    Route::delete('archive/users/{id}/force', [\App\Http\Controllers\ArchiveController::class, 'forceDeleteUser'])->name('archive.users.force');
});

// Test route for archive (no auth)
Route::get('/test-archive', function () {
    return Inertia::render('Archive', [
        'posts' => [],
        'products' => [],
        'users' => [],
        'stats' => [
            'posts' => 0,
            'products' => 0,
            'users' => 0,
            'total' => 0
        ]
    ]);
})->name('test.archive');

// Archive Management Routes
Route::get('archive-test', [\App\Http\Controllers\ArchiveController::class, 'index'])->name('archive.test');

// API route for archive stats
Route::get('api/archive/stats', [\App\Http\Controllers\ArchiveController::class, 'getStats'])
    ->name('api.archive.stats')
    ->middleware(['auth']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
