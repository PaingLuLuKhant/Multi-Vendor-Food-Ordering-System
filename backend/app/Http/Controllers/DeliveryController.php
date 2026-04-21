<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DeliveryController extends Controller
{
    public function showLogin()
    {
        return view('delivery.login');
    }

    public function login(Request $request)
    {
        $rider = Delivery::where('phone', $request->phone)->first();

        if (! $rider || ! Hash::check($request->password, $rider->password)) {
            return back()->with('error', 'Invalid phone or password');
        }

        session(['deli_id' => $rider->id]);

        return redirect('/deli-panel');
    }

    public function panel()
    {
        $deliId = session('deli_id');

        if (! $deliId) {
            return redirect('/deli-login');
        }

        $orders = Order::with(['orderItems.product', 'user'])
            ->where('delivery_id', $deliId)
            ->where('delivery_status', 'assigned')
            ->orderByDesc('created_at')
            ->get();

        return view('delivery.panel', compact('orders'));
    }

    public function markDelivered($orderId)
    {
        $deliId = session('deli_id');

        if (! $deliId) {
            return back()->with('error', 'Not logged in.');
        }

        $order = Order::with('orderItems')
            ->where('id', $orderId)
            ->where('delivery_id', $deliId)
            ->first();

        if (! $order) {
            return back()->with('error', 'Order not found or not assigned to you.');
        }

        $assignedItems = $order->orderItems()
            ->where('delivery_id', $deliId)
            ->update(['delivery_status' => 'completed']);

        if ($assignedItems === 0) {
            return back()->with('error', 'No assigned items were found for this order.');
        }

        $hasIncompleteItems = $order->orderItems()
            ->where('delivery_status', '!=', 'completed')
            ->exists();

        $order->delivery_status = $hasIncompleteItems ? 'partial' : 'completed';
        $order->status = $hasIncompleteItems ? 'partial' : 'completed';
        $order->save();

        return back()->with('success', 'Order marked as completed!');
    }
}
