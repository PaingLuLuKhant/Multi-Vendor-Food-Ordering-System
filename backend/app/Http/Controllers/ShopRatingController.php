<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\ShopRating;
use Illuminate\Support\Facades\Auth;

class ShopRatingController extends Controller
{
    // GET /shops/{shop}/ratings
    public function index(Shop $shop)
    {
        $ratings = $shop->ratings()->with('user:id,name')->get();

        $average = $shop->ratings()->avg('rating');
        $count = $shop->ratings()->count();

        $userRating = null;
        if (Auth::check()) {
            $userRating = $shop->ratings()
                ->where('user_id', Auth::id())
                ->first();
        }

        return response()->json([
            'ratings' => $ratings,
            'average_rating' => round($average ?? 0, 1),
            'total_ratings' => $count,
            'user_rating' => $userRating,
        ]);
    }

    // POST /shops/{shop}/ratings
    public function store(Request $request, Shop $shop)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $rating = ShopRating::updateOrCreate(
            [
                'shop_id' => $shop->id,
                'user_id' => Auth::id(),
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return response()->json([
            'message' => 'Rating submitted successfully',
            'rating' => $rating,
        ], 201);
    }
}


