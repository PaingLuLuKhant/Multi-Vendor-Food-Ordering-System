<?php

namespace App\Filament\Resources\ShopOrders\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Actions\ViewAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use Illuminate\Support\Facades\Auth;
use App\Models\Shop;

class ShopOrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // Customer name
                TextColumn::make('user.name')
                    ->label('Customer')
                    ->sortable()
                    ->searchable(),

                // ✅ Product names ONLY from this shop
                TextColumn::make('shop_products')
                    ->label('Product Name')
                    ->getStateUsing(function ($record) {
                        $userId = Auth::id();

                        $shopIds = Shop::where('user_id', $userId)->pluck('id');

                        return $record->orderItems
                            ->filter(fn ($item) =>
                                $item->product &&
                                $shopIds->contains($item->product->shop_id)
                            )
                            ->map(fn ($item) =>
                                $item->product->name . ' x ' . $item->quantity
                            )
                            ->join(', ');
                    })
                    ->wrap(),

                // ✅ Total ONLY from this shop
                TextColumn::make('shop_total_amount')
                    ->label('Total amount')
                    ->money('USD')
                    ->getStateUsing(function ($record) {
                        $userId = Auth::id();

                        $shopIds = Shop::where('user_id', $userId)->pluck('id');

                        return $record->orderItems
                            ->filter(fn ($item) =>
                                $item->product &&
                                $shopIds->contains($item->product->shop_id)
                            )
                            ->sum(fn ($item) =>
                                $item->price * $item->quantity
                            );
                    })
                    ->sortable(),

                // Status
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'processing',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ])
                    ->sortable(),

                // Created time
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'pending' => 'Pending',
                    'processing' => 'Processing',
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled',
                ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
