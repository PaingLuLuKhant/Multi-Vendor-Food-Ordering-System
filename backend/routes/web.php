<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeliveryController;

// routes/web.php
// Route::get('/login', function () {
//     return 'Login page placeholder';
// })->name('login');

Route::get('/', function () {
    return view('welcome');
});

Route::get('/products',[ProductController::class , 'index']);
Route::get('/deli-login', [DeliveryController::class, 'showLogin']);
Route::post('/deli-login', [DeliveryController::class, 'login']);

Route::get('/deli-panel', [DeliveryController::class, 'panel']);
Route::post('/deli/{id}/delivered', [DeliveryController::class, 'markDelivered']);


// Route::get('/shop-register', [ShopOwnerRegister::class, 'render'])
//     ->name('shop.register');
