<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserFavorite extends Model
{
    use HasFactory;

    protected $table = 'user_favorites';

    protected $fillable = [
        'user_id',
        'shop_id'
    ];

    /**
     * Get the user that owns the favorite.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the shop that is favorited.
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }
}
