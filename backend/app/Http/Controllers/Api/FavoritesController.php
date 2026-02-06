<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\UserFavorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FavoritesController extends Controller
{
    /**
     * Display a listing of the user's favorite shops.
     */
    public function index()
    {
        $user = Auth::user();

        // Get favorite shop IDs
        $favoriteIds = $user->favorites()->pluck('shop_id')->toArray();

        // Get full shop details for favorite shops
        $favoriteShops = Shop::whereIn('id', $favoriteIds)
            ->withCount('products')
            ->get();

        return response()->json([
            'success' => true,
            'favorite_ids' => $favoriteIds,
            'favorite_shops' => $favoriteShops,
            'count' => count($favoriteIds)
        ]);
    }

    /**
     * Check if a shop is favorited.
     */
    public function check($shopId)
    {
        $user = Auth::user();
        $isFavorite = $user->hasFavorited($shopId);

        return response()->json([
            'success' => true,
            'is_favorite' => $isFavorite,
            'shop_id' => (int)$shopId
        ]);
    }

    /**
     * Add a shop to favorites.
     */
    public function store($shopId)
    {
        $user = Auth::user();

        // Validate shop exists
        $shop = Shop::find($shopId);
        if (!$shop) {
            return response()->json([
                'success' => false,
                'error' => 'Shop not found'
            ], 404);
        }

        // Check if already favorited
        if ($user->hasFavorited($shopId)) {
            return response()->json([
                'success' => true,
                'message' => 'Shop already in favorites',
                'action' => 'already_favorited'
            ]);
        }

        // Add to favorites
        try {
            $user->favorites()->create([
                'shop_id' => $shopId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Shop added to favorites',
                'shop_id' => $shopId,
                'action' => 'added'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to add to favorites: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a shop from favorites.
     */
    public function destroy($shopId)
    {
        $user = Auth::user();

        // Remove from favorites
        $deleted = $user->favorites()->where('shop_id', $shopId)->delete();

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Shop removed from favorites',
                'shop_id' => $shopId,
                'action' => 'removed'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Shop was not in favorites',
            'action' => 'not_favorited'
        ]);
    }

    /**
     * Toggle favorite status (add/remove).
     */
    public function toggle($shopId)
    {
        $user = Auth::user();

        // Validate shop exists
        $shop = Shop::find($shopId);
        if (!$shop) {
            return response()->json([
                'success' => false,
                'error' => 'Shop not found'
            ], 404);
        }

        if ($user->hasFavorited($shopId)) {
            // Remove from favorites
            $user->favorites()->where('shop_id', $shopId)->delete();

            return response()->json([
                'success' => true,
                'is_favorite' => false,
                'message' => 'Removed from favorites',
                'action' => 'removed'
            ]);
        } else {
            // Add to favorites
            $user->favorites()->create([
                'shop_id' => $shopId
            ]);

            return response()->json([
                'success' => true,
                'is_favorite' => true,
                'message' => 'Added to favorites',
                'action' => 'added'
            ]);
        }
    }
}
