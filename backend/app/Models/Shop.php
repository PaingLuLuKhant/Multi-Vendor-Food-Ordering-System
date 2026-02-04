<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\ShopRating;

class Shop extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'phone',
        'address',
        'description',
        'category',
        'status',
    ];
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function ratings()
    {
        return $this->hasMany(ShopRating::class);
    }

    // ⭐ Average rating
    public function averageRating()
    {
        return round($this->ratings()->avg('rating'), 1);
    }

    // ⭐ Total reviews
    public function ratingsCount()
    {
        return $this->ratings()->count();
    }
   
}
