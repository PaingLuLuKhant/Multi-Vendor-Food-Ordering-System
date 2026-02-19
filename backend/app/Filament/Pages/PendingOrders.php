<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Tables;
use Filament\Tables\Table;
use App\Models\Order;
use App\Models\Shop;
use Illuminate\Support\Facades\Auth;
use BackedEnum;
use UnitEnum;
use Filament\Support\Icons\Heroicon;
use App\Models\OrderItem;

class PendingOrders extends Page implements Tables\Contracts\HasTable
{
    use Tables\Concerns\InteractsWithTable;

    protected string $view = 'filament.pages.pending-orders';

    // Navigation
    protected static string|UnitEnum|null $navigationGroup = 'Order';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Clock;
    protected static ?string $navigationLabel = 'Pending Orders';
    protected static ?int $navigationSort = 2;

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }

    // ✅ Return only orders that include shop owner's products
    protected function getTableQuery(): \Illuminate\Database\Eloquent\Builder
{
    $user = Auth::user();
    $shopIds = Shop::where('user_id', $user->id)->pluck('id');

    // ✅ FIX: Only show items that are NOT completed
    return OrderItem::query()
        ->with(['order.user', 'product.shop'])
        ->whereIn('delivery_status', ['pending', 'assigned']) // Only pending/assigned
        ->whereHas('product', function ($q) use ($shopIds) {
            $q->whereIn('shop_id', $shopIds);
        });
}



    protected function getTableColumns(): array
    {
        $user = Auth::user();
        $shopIds = Shop::where('user_id', $user->id)->pluck('id');

        return [

            Tables\Columns\TextColumn::make('order.id')
                ->label('Order ID')
                ->sortable(),

            Tables\Columns\TextColumn::make('order.user.name')
                ->label('Customer')
                ->searchable(),

            Tables\Columns\TextColumn::make('product.name')
                ->label('Product'),

            Tables\Columns\TextColumn::make('quantity')
                ->label('Qty'),

            Tables\Columns\TextColumn::make('delivery_status')
                ->label('Status')
                ->badge()
                ->formatStateUsing(fn (string $state): string =>
                    $state === 'assigned' ? 'Delivery Assigned' : ucfirst($state)
                )
                ->color(fn(string $state): string => match (strtolower($state)) {
                    'completed' => 'success',
                    'pending' => 'warning',
                    'assigned' => 'primary',
                    default => 'gray',
                })
                ->sortable(),
        ];
    }
    public static function canAccess(): bool
    {
        return auth()->user()->shop?->status === 'approved';
    }
}
