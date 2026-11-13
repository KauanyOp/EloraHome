<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ApiAuthController;

Route::post('auth/register', [ApiAuthController::class, 'register'])->middleware('throttle:6,1');
Route::post('auth/login', [ApiAuthController::class, 'login'])->middleware('throttle:6,1');

Route::get('categories', [CategoryController::class, 'index']);
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);

Route::middleware(['auth:sanctum', 'active', 'admin'])->get('admin/products', [ProductController::class, 'indexAdmin']);

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('auth/me', [ApiAuthController::class, 'me']);
    Route::post('auth/logout', [ApiAuthController::class, 'logout']);
    Route::get('orders/mine', [OrderController::class, 'mine']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'active', 'admin'])->group(function () {
    Route::apiResource('categories', CategoryController::class)->except(['index']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::apiResource('users', UserController::class);
    Route::get('orders', [OrderController::class, 'index']);
    Route::patch('orders/{order}', [OrderController::class, 'update']);
    Route::delete('orders/{order}', [OrderController::class, 'destroy']);
});
