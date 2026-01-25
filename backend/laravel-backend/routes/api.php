<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ShopController;
use Illuminate\Http\Request;

// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/register', [AuthController::class, 'register']);

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/orders', [OrderController::class , 'orders']);
//     Route::get('/shops', [ShopController::class , 'shops']);
//     Route::get('/shops/{id}', [ShopController::class, 'showShops']);
//     // Route::get('/user', [AuthController::class, 'user']);
// });



// nw's
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/shops', [ShopController::class, 'allShops']);        // All shops
Route::get('/shops/{id}', [ShopController::class, 'showSpecificShop']);    // Single shop + products

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders', [OrderController::class, 'orders']);

});

