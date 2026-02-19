<?php

// namespace App\Filament\Pages;

// use Filament\Pages\Page;
// use Filament\Tables;
// use App\Models\Order;
// use App\Models\Shop;
// use Illuminate\Support\Facades\Auth;
// use BackedEnum;
// use UnitEnum;
// use Filament\Support\Icons\Heroicon;

// class PendingOrders extends Page implements Tables\Contracts\HasTable
// {
//     use Tables\Concerns\InteractsWithTable;

//     protected string $view = 'filament.pages.pending-orders';

//     // Navigation
//     protected static string|UnitEnum|null $navigationGroup = 'Order';
//     protected static string|BackedEnum|null $navigationIcon = Heroicon::Clock;
//     protected static ?string $navigationLabel = 'Pending Orders';
//     protected static ?int $navigationSort = 2;

//     public static function shouldRegisterNavigation(): bool
//     {
//         return true;
//     }

//     // ✅ Query: Only orders with at least 1 pending/assigned item for this shop
//     protected function getTableQuery()
//     {
//         $user = Auth::user();
//         $shopIds = Shop::where('user_id', $user->id)->pluck('id');

//         return Order::query()
//             ->with(['user', 'orderItems' => fn($q) => $q->with('product.shop')])
//             ->whereHas('orderItems.product', function ($q) use ($shopIds) {
//                 $q->whereIn('shop_id', $shopIds)
//                 ->whereIn('delivery_status', ['pending', 'assigned']);
//             })

//             ->orderByDesc('created_at');
//     }

//     protected function getTableColumns(): array
//     {
//         $user = Auth::user();
//         $shopIds = Shop::where('user_id', $user->id)->pluck('id');

//         return [
//             Tables\Columns\TextColumn::make('id')
//                 ->label('Order ID')
//                 ->sortable(),

//             Tables\Columns\TextColumn::make('user.name')
//                 ->label('Customer')
//                 ->searchable(),

//             Tables\Columns\TextColumn::make('products')
//     ->label('Products')
//     ->getStateUsing(function ($record) use ($shopIds) {
//         $items = $record->orderItems
//             ->filter(fn($item) =>
//                 in_array($item->product->shop_id, $shopIds->toArray()) &&
//                 in_array($item->delivery_status, ['pending', 'assigned'])
//             );

//         if ($items->isEmpty()) {
//             return '-';
//         }

//         // Option 1: Line breaks (simpler)
//         return $items
//             ->map(fn($item) => $item->product->name . ' x ' . $item->quantity)
//             ->join('<br>');

//         // Option 2: Badges (fancier)
//         // return $items
//         //     ->map(fn($item) => "<span class='inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'>"
//         //         . $item->product->name . ' x ' . $item->quantity .
//         //       "</span>")
//         //     ->join(' ');
//     })
//     ->html() // required for <br> or badge HTML to render
//     ->wrap(),


//             Tables\Columns\TextColumn::make('quantity')
//                 ->label('Total Qty')
//                 ->getStateUsing(fn($record) =>
//                     $record->orderItems
//                         ->filter(fn($item) =>
//                             in_array($item->product->shop_id, $shopIds->toArray()) &&
//                             in_array($item->delivery_status, ['pending', 'assigned'])
//                         )
//                         ->sum('quantity')
//                 ),

//             Tables\Columns\TextColumn::make('total_price')
//                 ->label('Total')
//                 ->getStateUsing(fn($record) =>
//                     $record->orderItems
//                         ->filter(fn($item) =>
//                             in_array($item->product->shop_id, $shopIds->toArray()) &&
//                             in_array($item->delivery_status, ['pending', 'assigned'])
//                         )
//                         ->sum(fn($item) => $item->price * $item->quantity)
//                 )
//                 ->money('MMK')
//                 ->sortable(),

//             Tables\Columns\TextColumn::make('status')
//                 ->label('Status')
//                 ->badge()
//                 ->getStateUsing(fn($record) =>
//                     collect($record->orderItems)
//                         ->filter(fn($item) =>
//                             in_array($item->product->shop_id, $shopIds->toArray()) &&
//                             in_array($item->delivery_status, ['pending', 'assigned'])
//                         )
//                         ->pluck('delivery_status')
//                         ->unique()
//                         ->map(fn($s) => $s === 'assigned' ? 'Delivery Assigned' : ucfirst($s))
//                         ->join(', ')
//                 )
//                 ->color(fn($record) =>
//                     collect($record->orderItems)
//                         ->filter(fn($item) =>
//                             in_array($item->product->shop_id, $shopIds->toArray()) &&
//                             in_array($item->delivery_status, ['pending', 'assigned'])
//                         )
//                         ->pluck('delivery_status')
//                         ->contains('pending') ? 'warning' : 'primary'
//                 )
//                 ->sortable(),
//         ];
//     }

//     public static function canAccess(): bool
//     {
//         return auth()->user()->shop?->status === 'approved';
//     }
// }


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

    // Navigation
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
        $shopIds = Shop::where('user_id', $user->id)->pluck('id');

        $this->pendingOrders = Order::with(['user', 'orderItems.product.shop'])
            ->whereHas('orderItems.product', function ($q) use ($shopIds) {
                $q->whereIn('shop_id', $shopIds)
                  ->whereIn('delivery_status', ['pending', 'assigned']);
            })
            ->orderByDesc('created_at')
            ->get();
    }

    public function assignDelivery($orderId, $deliveryId)
    {
        $user = Auth::user();
        $shopIds = Shop::where('user_id', $user->id)->pluck('id');

        $order = Order::with('orderItems.product')->findOrFail($orderId);

        $pendingItems = $order->orderItems
            ->filter(fn($item) =>
                in_array($item->product->shop_id, $shopIds->toArray()) &&
                in_array($item->delivery_status, ['pending', 'assigned'])
            );

        foreach ($pendingItems as $item) {
            $item->delivery_id = $deliveryId;
            $item->delivery_status = 'assigned';
            $item->save();
        }

        if ($pendingItems->isNotEmpty()) {
            $order->status = 'assigned';
            $order->save();
        }

        Notification::make()
            ->success()
            ->title('Delivery Assigned')
            ->body('Delivery person has been assigned successfully.')
            ->send();

        $this->loadPendingOrders();
    }

    public static function canAccess(): bool
    {
        return auth()->user()->shop?->status === 'approved';
    }
}
