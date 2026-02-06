<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class ShopRating extends Model
// {
//     protected $fillable = [
//         'shop_id',
//         'user_id',
//         'rating',
//         'comment', // Add comment field
//     ];

//     protected $casts = [
//         'rating' => 'integer',
//     ];

//     protected $with = ['user:id,name']; // Eager load user

//     public function shop()
//     {
//         return $this->belongsTo(Shop::class);
//     }

//     public function user()
//     {
//         return $this->belongsTo(User::class);
//     }
// }

// app/Models/ShopRating.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopRating extends Model
{
    use HasFactory;

    protected $fillable = ['shop_id', 'user_id', 'rating','comment'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function shop() {
        return $this->belongsTo(Shop::class);
    }
}

