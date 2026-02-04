<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShopRating;
use App\Models\Shop;
use Illuminate\Support\Facades\Auth;

class ShopRatingController extends Controller
{
    public function store(Request $request, Shop $shop)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Update existing or create new rating
        $rating = ShopRating::updateOrCreate(
            ['shop_id' => $shop->id, 'user_id' => $user->id],
            ['rating' => $request->rating]
        );

        $average = $shop->ratings()->avg('rating');
        $count = $shop->ratings()->count();

        return response()->json([
            'message' => 'Rating submitted successfully',
            'average_rating' => round($average, 1),
            'total_ratings' => $count,
        ]);
    }
}
