<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Shop;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
class DeliveryController extends Controller
{
    // Login page (keep as is)
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

        // Very simple session login
        session(['deli_id' => $rider->id]);

        return redirect('/deli-panel');
    }

    // Delivery panel
    public function panel()
    {
        $deliId = session('deli_id');


        $orderItems = OrderItem::with('product.shop', 'order.user')
            ->where('delivery_id', $deliId)
            ->where('delivery_status', 'assigned') // only assigned items
            ->get();

        return view('delivery.panel', compact('orderItems'));
    }

    // Mark delivered
//  public function markDelivered($id)
// {
//     $item = OrderItem::with('order')->find($id);

//     if (!$item) {
//         return back()->with('error', 'Item not found');
//     }

//     // Update the delivery status of this item
//     $item->delivery_status = 'completed';
//     $item->save();

//     // Load order
//     $order = $item->order;

//     if ($order) {
//         // Check if all items are completed
//         $allCompleted = $order->orderItems()->where('delivery_status', '!=', 'completed')->doesntExist();

//         if ($allCompleted) {
//             $order->status = 'completed';
//             $order->save();
//         }
//     }

//     return back()->with('success', 'Order updated!');
// }

public function markDelivered($orderId)
{
    // Load the order with items
    $order = Order::with('orderItems.product')->find($orderId);

    if (!$order) {
        return back()->with('error', 'Order not found');
    }

    // Filter items belonging to this shop and not already completed
    $shopIds = Shop::where('user_id', auth()->id())->pluck('id');

    $itemsToUpdate = $order->orderItems
        ->filter(fn($item) =>
            in_array($item->product->shop_id, $shopIds->toArray()) &&
            $item->delivery_status !== 'completed'
        );

    // Update all items to completed
    foreach ($itemsToUpdate as $item) {
        $item->delivery_status = 'completed';
        $item->save();
    }

    // If all items of the order are completed, update order status
    $allCompleted = $order->orderItems()->where('delivery_status', '!=', 'completed')->doesntExist();
    if ($allCompleted) {
        $order->status = 'completed';
        $order->save();
    }

    return back()->with('success', 'Order updated!');
}




}
