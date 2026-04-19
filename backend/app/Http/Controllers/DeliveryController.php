<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DeliveryController extends Controller
{
    // Login page
    public function showLogin()
    {
        return view('delivery.login');
    }

    public function login(Request $request)
    {
        $rider = Delivery::where('phone', $request->phone)->first();

        if (!$rider || !Hash::check($request->password, $rider->password)) {
            return back()->with('error', 'Invalid phone or password');
        }

        session(['deli_id' => $rider->id]);

        return redirect('/deli-panel');
    }

    // ✅ Delivery panel (NOW USES ORDERS, NOT ORDER_ITEMS)
    public function panel()
    {
        $deliId = session('deli_id');

        if (!$deliId) {
            return redirect('/deli-login');
        }

        $orders = Order::with(['orderItems.product', 'user'])
            ->where('delivery_id', $deliId)
            ->where('delivery_status', 'assigned')
            ->orderByDesc('created_at')
            ->get();

        return view('delivery.panel', compact('orders'));
    }

    // ✅ Mark FULL ORDER as delivered
    public function markDelivered($orderId)
    {
        $deliId = session('deli_id');

        if (!$deliId) {
            return back()->with('error', 'Not logged in.');
        }

        // ✅ Only allow assigned delivery person
        $order = Order::where('id', $orderId)
            ->where('delivery_id', $deliId)
            ->first();

        if (!$order) {
            return back()->with('error', 'Order not found or not assigned to you.');
        }

        // ✅ Update order ONLY (no more order_items update)
        $order->delivery_status = 'completed';
        $order->status = 'completed';
        $order->save();

        return back()->with('success', 'Order marked as completed!');
    }
}