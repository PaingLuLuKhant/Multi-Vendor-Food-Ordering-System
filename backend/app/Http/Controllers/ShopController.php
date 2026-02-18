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
use Carbon\Carbon;

class ShopController extends Controller
{
    /**
     * Get all shops (for shop list / cards)
     */
    public function allShops(Request $request)
    {
        $shops = Shop::with('products', 'ratings')->get();
        $now = Carbon::now()->format('H:i');

        $shops->transform(function ($shop) {
            $shop->average_rating = round($shop->ratings->avg('rating') ?? 0, 1);
            $shop->review_count = $shop->ratings->count();
            $shop->is_open_now = $shop->isOpen(); // ✅ single source of truth
            return $shop;
        });


        return response()->json([
            'shops' => $shops
        ]);
    }

    /**
     * Get single shop (shop page)
     */
    public function showSpecificShop($id)
    {
        $shop = Shop::with('products', 'ratings')->find($id);

        if (!$shop) {
            return response()->json([
                'message' => 'Shop not found'
            ], 404);
        }

        $now = Carbon::now()->format('H:i');

        // ⭐ ratings
        $shop->average_rating = round($shop->ratings->avg('rating') ?? 0, 1);
        $shop->review_count   = $shop->ratings->count();

        // 🕒 open / close logic
        if ($shop->is_closed_today) {
            $shop->is_open_now = false;
        } else {
            $shop->is_open_now =
                $shop->open_time &&
                $shop->close_time &&
                $now >= $shop->open_time &&
                $now <= $shop->close_time;
        }

        return response()->json([
            'shop' => $shop
        ], 200);
    }

    /**
     * Simple index (if you still use it)
     */
    public function index()
    {
        $shops = Shop::with('ratings')->get();
        $now = Carbon::now()->format('H:i');

        $shops->transform(function ($shop) use ($now) {
            $shop->average_rating = round($shop->ratings->avg('rating') ?? 0, 1);
            $shop->review_count   = $shop->ratings->count();

            if ($shop->is_closed_today) {
                $shop->is_open_now = false;
            } else {
                $shop->is_open_now =
                    $shop->open_time &&
                    $shop->close_time &&
                    $now >= $shop->open_time &&
                    $now <= $shop->close_time;
            }

            return $shop;
        });

        return response()->json($shops);
    }
}
