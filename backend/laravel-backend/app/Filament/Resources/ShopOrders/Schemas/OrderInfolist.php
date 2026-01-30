<?php

namespace App\Filament\Resources\ShopOrders\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
class ShopOrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('id')
                    ->label('Order ID'),

                TextEntry::make('user.name')
                    ->label('Customer'),

                TextEntry::make('status'),

                // Shop total amount: only your products
                TextEntry::make('shop_total_amount')
                    ->label('Total Amount')
                    ->getStateUsing(function ($record) {
                        $userId = Auth::id();
                        $shopIds = \App\Models\Shop::where('user_id', $userId)->pluck('id');

                        return $record->orderItems
                            ->whereIn('product.shop_id', $shopIds)
                            ->sum(fn($item) => $item->price * $item->quantity);
                    })
                    ->money('USD'),

                // Show products from your shop
                TextEntry::make('shop_items')
                    ->label('Products from My Shop')
                    ->getStateUsing(function ($record) {
                        $userId = Auth::id();
                        $shopIds = \App\Models\Shop::where('user_id', $userId)->pluck('id');

                        return $record->orderItems
                            ->whereIn('product.shop_id', $shopIds)
                            ->map(fn($item) => $item->product->name . ' x ' . $item->quantity)
                            ->join(', ');
                    }),

                TextEntry::make('paid_time')
                    ->label('Paid Time')
                    ->dateTime(),

                TextEntry::make('created_at')
                    ->dateTime(),

                TextEntry::make('updated_at')
                    ->dateTime(),
            ]);
    }
}
