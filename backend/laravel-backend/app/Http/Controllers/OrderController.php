<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductStock;

class OrderController extends Controller
{
    public function orders(Request $request)
    {   
        $user = $request->user();
        \Log::info('Authenticated user:', ['user' => $user]);

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // $orders = Order::where('user_id', $user->id)->get();

        $orders = Order::where('user_id', auth()->id())
            ->with(['orderItems.product']) // 🔥 important
            ->latest()
            ->get();

        $orders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,

                // 👇 match frontend: order.items
                'items' => $order->orderItems->map(function ($item) {
                    return [
                        'name' => $item->product?->name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                    ];
                }),
            ];
        });

        return response()->json($orders);
    }
    
}
