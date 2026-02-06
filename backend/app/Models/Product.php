<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Add this:
    protected $fillable = [
        'name',
        'price',
        'image',
        'shop_id',
        'created_at',
    ];
    public function shop() { return $this->belongsTo(Shop::class); }

    // new addition 20.1.26
        public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

}
