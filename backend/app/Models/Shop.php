<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon; // ADD THIS

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
        'open_time',
        'close_time',
        'is_closed_today',
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
    /**
     * Get the favorites for this shop.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class);
    }

    /**
     * Get the users who favorited this shop.
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_favorites', 'shop_id', 'user_id')
            ->withTimestamps();
    }

    /**
     * Check if this shop is favorited by a specific user.
     */
    public function isFavoritedBy($userId): bool
    {
        return $this->favorites()->where('user_id', $userId)->exists();
    }
    public function isOpen(): bool
    {
        if ($this->is_closed_today) {
            return false;
        }

        if (!$this->open_time || !$this->close_time) {
            return false;
        }

        $now = Carbon::now('Asia/Yangon')->format('H:i');

        return $now >= $this->open_time && $now <= $this->close_time;
    }
}
