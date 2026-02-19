<?php

// namespace App\Filament\Resources\ShopOrders\Tables;

// use Filament\Tables\Table;
// use Filament\Tables\Columns\TextColumn;
// // use Filament\Actions\ViewAction;
// use Illuminate\Support\Facades\Auth;
// use App\Models\Shop;
// use App\Models\OrderItem;

// class ShopOrdersTable
// {
//     public static function configure(Table $table): Table
//     {
//         return $table
//             ->query(
//                 fn() => OrderItem::with(['order.user', 'product.shop'])
//                 ->where('delivery_status', 'completed')
//                     ->whereHas('product', function ($q) {
//                         $shopIds = Shop::where('user_id', Auth::id())->pluck('id');
//                         $q->whereIn('shop_id', $shopIds);
//                     })
//             )
//             ->columns([
//                 TextColumn::make('row_number')
//                     ->rowIndex()
//                     ->label('#'),

//                 TextColumn::make('order.user.name')
//                     ->label('Customer Name')
//                     ->sortable()
//                     ->searchable(),

//                 TextColumn::make('product.name')
//                     ->label('Product')
//                     // ->formatStateUsing(
//                     //     fn($state, $record) => $state . ' x ' . $record->quantity
//                     // )
//                     ->formatStateUsing(
//                         fn($state, $record) => $state
//                     )
//                     ->wrap(),

//                 TextColumn::make('quantity')
//                     ->label('Qty'),

//                 TextColumn::make('price')
//                     ->label('Unit Price')
//                     ->money('MMK'),



//                 TextColumn::make('total')
//                     ->label('Total')
//                     ->getStateUsing(fn($record) => $record->price * $record->quantity)
//                     ->money('MMK')
//                     ->sortable(),

//                 TextColumn::make('delivery_status')
//                     ->label('Status')
//                     ->badge()
//                     ->color(fn (string $state): string => match ($state) {
//                         'completed' => 'success',
//                         'pending' => 'warning',
//                         'assigned' => 'primary',
//                         default => 'gray',
//                     })
//                     ->sortable(),

//                 TextColumn::make('order.id')
//                     ->label('Order ID')
//                     ->sortable(),

//                 TextColumn::make('order.created_at')
//                     ->label('Ordered at')
//                     ->formatStateUsing(fn($state) =>
//                         \Carbon\Carbon::parse($state)->diffForHumans(['short' => true])
//                     )
//                     ->sortable(),
//             ])
//             ->recordActions([
//                 // ViewAction::make(),
//             ]);

//     }
// }



namespace App\Filament\Resources\ShopOrders\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\Facades\Auth;
use App\Models\Shop;
use App\Models\Order;

class ShopOrdersTable
{
    public static function configure(Table $table): Table
    {
        $user = Auth::user();
        $shopIds = Shop::where('user_id', $user->id)->pluck('id');

        return $table
            ->query(
                fn() => Order::with(['user', 'orderItems.product.shop'])
                    ->whereHas('orderItems.product', fn($q) => $q->whereIn('shop_id', $shopIds))
                    // Only include orders that have completed items for this shop
                    ->whereHas('orderItems', fn($q) =>
                        $q->whereIn('delivery_status', ['completed'])
                          ->whereHas('product', fn($q2) => $q2->whereIn('shop_id', $shopIds))
                    )
                    ->orderByDesc('created_at')
            )
            ->columns([
                TextColumn::make('row_number')
                    ->rowIndex()
                    ->label('#'),
                    TextColumn::make('id')
                    ->label('Order ID')
                    ->sortable(),

                TextColumn::make('user.name')
                    ->label('Customer Name')
                    ->sortable()
                    ->searchable(),

                // Products column: concatenate all products x quantity
                TextColumn::make('products')
    ->label('Products')
    ->getStateUsing(function ($record) use ($shopIds) {
        $items = $record->orderItems
            ->filter(fn($item) => in_array($item->product->shop_id, $shopIds->toArray()));

        return $items->map(fn($item) => $item->product->name . ' x ' . $item->quantity)
                     ->join('<br>'); // line break
    })
    ->html()  // allow HTML rendering
    ->wrap(),

                // Quantity column: sum of quantities for this order
                TextColumn::make('quantity')
                    ->label('Total Qty')
                    ->getStateUsing(fn($record) =>
                        $record->orderItems
                            ->filter(fn($item) => in_array($item->product->shop_id, $shopIds->toArray()))
                            ->filter(fn($item) => $item->delivery_status === 'completed')
                            ->sum('quantity')
                    ),

                // Total column: sum of price * quantity
                TextColumn::make('total')
                    ->label('Total')
                    ->getStateUsing(fn($record) =>
                        $record->orderItems
                            ->filter(fn($item) => in_array($item->product->shop_id, $shopIds->toArray()))
                            ->filter(fn($item) => $item->delivery_status === 'completed')
                            ->sum(fn($item) => $item->price * $item->quantity)
                    )
                    ->money('MMK')
                    ->sortable(),

                // Status column: just show "Completed"
                TextColumn::make('delivery_status')
                    ->label('Status')
                    ->getStateUsing(fn() => 'Completed')
                    ->badge()
                    ->color(fn() => 'success')
                    ->sortable(),



                // TextColumn::make('delivered_at')
                //     ->label('Delivered at')
                //     ->formatStateUsing(fn($state) =>
                //         \Carbon\Carbon::parse($state)->diffForHumans(['short' => true])
                //     )
                //     ->sortable(),
                        TextColumn::make('delivered_at')
            ->label('Delivered at')
            ->getStateUsing(function ($record) {
                // Find the latest completed order item for this order
                $completedItem = $record->orderItems
                    ->where('delivery_status', 'completed')
                    ->sortByDesc('updated_at') // assuming updated_at changes when status changes
                    ->first();

                if (! $completedItem) {
                    return '-';
                }

                return \Carbon\Carbon::parse($completedItem->updated_at)
                    ->diffForHumans(['short' => true]); // e.g., "2h ago"
            })
            ->sortable()
            ]);
    }
}
