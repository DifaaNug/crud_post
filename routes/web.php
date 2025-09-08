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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
