<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shop extends Model
{
    use HasFactory; 
    protected $fillable = [
        'name',
        'phone',
        'address',
        'description',
        'category',
    ];
    public function products() { return $this->hasMany(Product::class); }
    public function owner() { return $this->belongsTo(User::class, 'user_id'); }

}
