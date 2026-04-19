<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;
use App\Models\Shop;

class ShopStatusList extends Widget
{
    protected string $view = 'filament.widgets.shop-status-list';

    protected int|string|array $columnSpan = 'full';

    protected function getViewData(): array
    {
        return [
            'activeShops' => Shop::whereHas('products')->get(),
            'inactiveShops' => Shop::doesntHave('products')->get(),
        ];
    }

    public static function canView(): bool
{
    return false;  // This will hide it completely
}
}