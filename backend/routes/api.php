<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ShopRatingController;
use App\Http\Controllers\Api\FavoritesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/shops', [ShopController::class, 'allShops']);        // All shops
Route::get('/shops/{id}', [ShopController::class, 'showSpecificShop']); // Single shop + products

// Public rating routes (anyone can view ratings)
Route::get('/shops/{shop}/ratings', [ShopRatingController::class, 'index']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Order routes
    Route::get('/orders', [OrderController::class, 'orders']);   // view orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/{order}/confirm', [OrderController::class, 'confirm']);

    // Favorite routes
    Route::get('/user/favorites', [FavoritesController::class, 'index']);
    Route::get('/user/favorites/{shop}/check', [FavoritesController::class, 'check']);
    Route::post('/user/favorites/{shop}', [FavoritesController::class, 'store']);
    Route::delete('/user/favorites/{shop}', [FavoritesController::class, 'destroy']);
    Route::post('/user/favorites/{shop}/toggle', [FavoritesController::class, 'toggle']);

    // Rating routes
    Route::post('/shops/{shop}/ratings', [ShopRatingController::class, 'store']);


});
