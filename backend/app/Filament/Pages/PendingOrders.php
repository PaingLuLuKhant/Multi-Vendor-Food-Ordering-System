<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Order;
use App\Models\Shop;
use App\Models\Delivery;
use Illuminate\Support\Facades\Auth;
use Filament\Notifications\Notification;
use BackedEnum;
use UnitEnum;

class PendingOrders extends Page
{
    protected string $view = 'filament.pages.pending-orders';

    protected static string|UnitEnum|null $navigationGroup = 'Order';
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clock';
    protected static ?string $navigationLabel = 'Pending Orders';
    protected static ?int $navigationSort = 2;

    public $pendingOrders = [];

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }

    public function mount()
    {
        $this->loadPendingOrders();
    }

    public function loadPendingOrders()
    {
        $user = Auth::user();
        
        if (!$user || !$user->shop) {
            $this->pendingOrders = collect();
            return;
        }
        
        $shopIds = Shop::where('user_id', $user->id)->pluck('id');

        $this->pendingOrders = Order::with(['user', 'orderItems.product.shop', 'delivery'])
            ->whereHas('orderItems.product', function ($q) use ($shopIds) {
                $q->whereIn('shop_id', $shopIds);
            })
            ->whereIn('delivery_status', ['pending', 'assigned', 'partial'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function($order) use ($shopIds) {
                // Check if THIS SHOP has already assigned their items
                $order->my_shop_assigned = $order->orderItems
                    ->filter(fn($item) => $item->product && in_array($item->product->shop_id, $shopIds->toArray()))
                    ->contains(fn($item) => $item->delivery_status === 'assigned');
                
                return $order;
            });
    }

    public function assignDelivery($orderId, $deliveryId)
    {
        $order = Order::findOrFail($orderId);
        $user = Auth::user();
        $shopIds = Shop::where('user_id', $user->id)->pluck('id');

        // Get only THIS SHOP's order items
        $myShopItems = $order->orderItems->filter(function($item) use ($shopIds) {
            return $item->product && in_array($item->product->shop_id, $shopIds->toArray());
        });

        // Check if this shop already assigned their items
        $alreadyAssigned = $myShopItems->contains(function($item) {
            return $item->delivery_status === 'assigned';
        });

        if ($alreadyAssigned) {
            Notification::make()
                ->warning()
                ->title('Already Assigned')
                ->body('You have already assigned a delivery person for your shop\'s items.')
                ->send();
            $this->loadPendingOrders();
            return;
        }

        // Assign delivery to ONLY THIS SHOP's order items
        foreach ($myShopItems as $item) {
            $item->delivery_id = $deliveryId;
            $item->delivery_status = 'assigned';
            $item->save();
        }

        // IMPORTANT: Update the main order with the delivery ID if not already set
        if ($order->delivery_id === null) {
            $order->delivery_id = $deliveryId;
            $order->delivery_status = 'assigned';
            $order->status = 'assigned';
            $order->save();
        }

        // Check if ALL items in order are assigned (from all shops)
        $allItemsAssigned = $order->orderItems->every(function($item) {
            return $item->delivery_status === 'assigned';
        });

        if ($allItemsAssigned) {
            $order->delivery_status = 'assigned';
            $order->status = 'assigned';
            $order->save();
        } else {
            $order->delivery_status = 'partial';
            $order->status = 'partial';
            $order->save();
        }

        Notification::make()
            ->success()
            ->title('Delivery Assigned')
            ->body('Delivery person assigned to your shop\'s items successfully.')
            ->send();

        $this->loadPendingOrders();
    }

    public function getDeliveryOptionsForOrder($orderId)
    {
        $order = Order::find($orderId);
        
        if (!$order) {
            return Delivery::all()->toArray();
        }
        
        // Check if ANY delivery has been assigned to this order (from any shop)
        $assignedDeliveryId = null;
        
        // First check order level
        if ($order->delivery_id) {
            $assignedDeliveryId = $order->delivery_id;
        } else {
            // Check if any order item has a delivery assigned
            $assignedItem = $order->orderItems()->whereNotNull('delivery_id')->first();
            if ($assignedItem) {
                $assignedDeliveryId = $assignedItem->delivery_id;
            }
        }
        
        // If a delivery is already assigned to this order (by any shop)
        if ($assignedDeliveryId) {
            // Return ONLY the assigned delivery person
            $delivery = Delivery::where('id', $assignedDeliveryId)->get();
            return $delivery->toArray();
        }
        
        // Otherwise return all delivery persons
        return Delivery::all()->toArray();
    }

    public static function canAccess(): bool
    {
        $user = auth()->user();
        return $user && $user->shop && $user->shop->status === 'approved';
    }
}