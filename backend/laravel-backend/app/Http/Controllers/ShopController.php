<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;

class ShopController extends Controller
{
    public function shops(Request $request){
        return response()->json([
            'shops' => Shop::with('products')->get()
        ]);

    }
    public function showShops($id)
    {
        $shop = Shop::with('products')->find($id);

        if (!$shop) {
            return response()->json([
                'message' => 'Shop not found'
            ], 404);
        }

        return response()->json([
            'shop' => $shop
        ], 200);
    }
}
