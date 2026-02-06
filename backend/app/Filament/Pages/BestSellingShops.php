<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use App\Models\Shop;

use BackedEnum;
use UnitEnum;

class BestSellingShops extends Page implements Tables\Contracts\HasTable
{
    use Tables\Concerns\InteractsWithTable;

    protected static string|UnitEnum|null $navigationGroup = 'Shop';
    protected static ?string $navigationLabel = 'Best Selling Shops';
    protected static ?int $navigationSort = 5;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-star';
    protected string $view = 'filament.pages.best-selling-shops';

    protected function getTableQuery()
    {
        return Shop::query()
            ->withCount([
                'products as total_orders' => function ($query) {
                    $query->join('order_items', 'order_items.product_id', '=', 'products.id')
                          ->select(\DB::raw('COUNT(DISTINCT order_items.order_id)'));
                }
            ])
            ->orderByDesc('total_orders')
            ->limit(5);
    }

    protected function getTableColumns(): array
    {
        return [
            // TextColumn::make('id')->label('Shop ID')->sortable(),
            TextColumn::make('row_number')
                ->rowIndex()
                ->label('#'),
            // Make shop name clickable to shop view page
            TextColumn::make('name')
                ->label('Shop Name')
                ->sortable(),
            TextColumn::make('owner.name')
                ->label('Owner Name'),
                

            TextColumn::make('total_orders')->label('Total Orders')->sortable(),
        ];
    }

    // Row actions not supported in Pages, so leave empty
protected function isTablePaginationEnabled(): bool
{
    return false; // disables pagination
}

public function getTableRecords(): \Illuminate\Support\Collection
{
    // Limit the collection to top 5
    return $this->getTableQuery()->take(10)->get();
}

    protected function getTableBulkActions(): array
    {
        return [];
    }
public static function shouldRegisterNavigation(): bool
    {
        return auth()->user()?->role === 'admin';
    }

}
