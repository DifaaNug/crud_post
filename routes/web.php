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

// Route untuk Products CRUD
Route::resource('products', \App\Http\Controllers\ProductController::class)->middleware(['auth']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
