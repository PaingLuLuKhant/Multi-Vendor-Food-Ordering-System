<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Support\Facades\DB;

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
    public function store(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            // 1️⃣ Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $request->total_amount,
                'status' => 'pending',
            ]);

            // 2️⃣ Create order items
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Order failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function confirm(Order $order)
    {
        $user = Auth::user();

        // 🔒 Must be logged in
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // 🔒 Only owner of order can confirm
        if ($order->user_id !== $user->id) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        // 🔒 Only pending orders can be confirmed
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Order cannot be confirmed'
            ], 400);
        }

        // ✅ Update status
        $order->update([
            'status' => 'completed',
            'paid_time' => now(),
        ]);

        return response()->json([
            'message' => 'Order completed successfully',
            'order' => $order,
        ]);
    }
    
}
