<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// routes/web.php
// Route::get('/login', function () {
//     return 'Login page placeholder';
// })->name('login');

Route::get('/', function () {
    return view('welcome');
});

Route::get('/products',[ProductController::class , 'index']);

// Route::get('/shop-register', [ShopOwnerRegister::class, 'render'])
//     ->name('shop.register');
