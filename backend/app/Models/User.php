<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'password',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function shop()
    {
        return $this->hasOne(Shop::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }


    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isShopOwner()
    {
        return $this->role === 'shop_owner';
    }
    public function canAccessPanel(Panel $panel): bool
    {
        // return in_array($this->role, ['admin', 'shop_owner']);
        if ($this->role === 'admin') {

            return true; // Admin always has access
        }
        if ($this->role === 'shop_owner') {

            // Allow panel access even if not approved,
            // BUT we will restrict features elsewhere
            return true;
        }

        return false;
    }
    public function shopApproved(): bool
    {
        return optional($this->shop)->status === 'approved';
    }


    public function shopRatings()
    {
        return $this->hasMany(\App\Models\ShopRating::class);
    }
    /**
     * Get the user's favorite shops.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class);
    }

    /**
     * Get the user's favorite shops with details (many-to-many).
     */
    public function favoriteShops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'user_favorites', 'user_id', 'shop_id')
                    ->withTimestamps()
                    ->orderBy('user_favorites.created_at', 'desc');
    }

    /**
     * Check if a shop is favorited by this user.
     */
    public function hasFavorited($shopId): bool
    {
        return $this->favorites()->where('shop_id', $shopId)->exists();
    }

}



