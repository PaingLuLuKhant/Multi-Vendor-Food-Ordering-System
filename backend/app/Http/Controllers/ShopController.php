<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use App\Models\Shop;

// class ShopController extends Controller
// {
//     public function allShops(Request $request){
//         return response()->json([
//             'shops' => Shop::with('products')->get()
//         ]);

//     }
//     public function showSpecificShop($id)
//     {
//         $shop = Shop::with('products')->find($id);

//         if (!$shop) {
//             return response()->json([
//                 'message' => 'Shop not found'
//             ], 404);
//         }

//         return response()->json([
//             'shop' => $shop
//         ], 200);
//     }
// }



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;

class ShopController extends Controller
{
    public function allShops(Request $request)
    {
        // Load shops with products AND ratings
        $shops = Shop::with('products', 'ratings')->get();

        // Add average rating and review count to each shop
        $shops->transform(function ($shop) {
            $shop->average_rating = round($shop->ratings->avg('rating'), 1); // average
            $shop->review_count = $shop->ratings->count();                   // total reviews
            return $shop;
        });

        return response()->json([
            'shops' => $shops
        ]);
    }

    public function showSpecificShop($id)
    {
        $shop = Shop::with('products', 'ratings')->find($id);

        if (!$shop) {
            return response()->json([
                'message' => 'Shop not found'
            ], 404);
        }

        // Add average rating and review count
        $shop->average_rating = round($shop->ratings->avg('rating') ?? 0, 1);
        $shop->review_count = $shop->ratings->count();

        return response()->json([
            'shop' => $shop
        ], 200);
    }

    public function index()
    {
        $shops = Shop::with('ratings')->get();

        $shops->transform(function ($shop) {
            $shop->average_rating = round($shop->ratings->avg('rating'), 1);
            $shop->review_count = $shop->ratings->count();
            return $shop;
        });

        return response()->json($shops);
    }
}
