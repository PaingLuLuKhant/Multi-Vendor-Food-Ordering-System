<?php

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
                    ->whereHas('orderItems.product', function ($q) use ($shopIds) {
                        $q->whereIn('shop_id', $shopIds);
                    })
                    ->where('delivery_status', 'completed')  // ← Check orders table
                    ->orderByDesc('created_at')
            )
            ->columns([
                TextColumn::make('row_number')
                    ->rowIndex()
                    ->label('#'),

                TextColumn::make('id')
                    ->label('Order ID'),

                TextColumn::make('user.name')
                    ->label('Customer Name')
                    ->searchable(),

                TextColumn::make('products')
                    ->label('Products')
                    ->getStateUsing(function ($record) use ($shopIds) {
                        $items = $record->orderItems
                            ->filter(fn($item) =>
                                in_array($item->product->shop_id, $shopIds->toArray())
                            );

                        if ($items->isEmpty()) {
                            return '-';
                        }

                        return $items
                            ->map(fn($item) => $item->product->name . ' x ' . $item->quantity)
                            ->join('<br>');
                    })
                    ->html()
                    ->wrap(),

                TextColumn::make('quantity')
                    ->label('Total Qty')
                    ->getStateUsing(fn($record) =>
                        $record->orderItems
                            ->filter(fn($item) =>
                                in_array($item->product->shop_id, $shopIds->toArray())
                            )
                            ->sum('quantity')
                    ),

                TextColumn::make('total')
                    ->label('Total')
                    ->getStateUsing(fn($record) =>
                        $record->orderItems
                            ->filter(fn($item) =>
                                in_array($item->product->shop_id, $shopIds->toArray())
                            )
                            ->sum(fn($item) => $item->price * $item->quantity)
                    )
                    ->money('MMK'),

                TextColumn::make('status')
                    ->label('Status')
                    ->getStateUsing(fn() => 'Completed')
                    ->badge()
                    ->color('success'),

                TextColumn::make('delivered_at')
                    ->label('Delivered at')
                    ->getStateUsing(function ($record) {
                        return $record->updated_at ? $record->updated_at->diffForHumans(['short' => true]) : '-';
                    }),
            ]);
    }
}