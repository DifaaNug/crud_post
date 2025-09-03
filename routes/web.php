<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


//Mendaftarkan Route Halaman Web
Route::resource('posts', \App\Http\Controllers\PostController::class)->middleware(['auth']);

// Route untuk Products - sementara halaman kosong dulu
Route::get('products', function () {
    return Inertia::render('products');
})->middleware(['auth'])->name('products.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
