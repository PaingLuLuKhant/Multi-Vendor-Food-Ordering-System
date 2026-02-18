<?php

namespace App\Filament\Resources\ShopOrders\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\ViewAction;
use Illuminate\Support\Facades\Auth;
use App\Models\Shop;
use App\Models\OrderItem;

class ShopOrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->query(
                fn() => OrderItem::with(['order.user', 'product.shop'])
                ->where('delivery_status', 'completed')
                    ->whereHas('product', function ($q) {
                        $shopIds = Shop::where('user_id', Auth::id())->pluck('id');
                        $q->whereIn('shop_id', $shopIds);
                    })
            )
            ->columns([
                TextColumn::make('row_number')
                    ->rowIndex()
                    ->label('#'),

                TextColumn::make('order.user.name')
                    ->label('Customer')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('product.name')
                    ->label('Product')
                    ->formatStateUsing(
                        fn($state, $record) => $state . ' x ' . $record->quantity
                    )
                    ->wrap(),

                TextColumn::make('price')
                    ->label('Unit Price')
                    ->money('MMK'),

                TextColumn::make('quantity')
                    ->label('Quantity'),

                TextColumn::make('total')
                    ->label('Total')
                    ->getStateUsing(fn($record) => $record->price * $record->quantity)
                    ->money('MMK')
                    ->sortable(),

                TextColumn::make('delivery_status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'pending' => 'warning',
                        'assigned' => 'primary',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('order.id')
                    ->label('Order ID')
                    ->sortable(),

                TextColumn::make('order.created_at')
                    ->label('Ordered at')
                    ->formatStateUsing(fn($state) =>
                        \Carbon\Carbon::parse($state)->diffForHumans(['short' => true])
                    )
                    ->sortable(),
            ])
            ->recordActions([
                ViewAction::make(),
            ]);
    }
}
