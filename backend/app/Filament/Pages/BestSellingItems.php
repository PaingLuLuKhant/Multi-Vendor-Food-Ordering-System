<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;

class BestSellingItems extends Page implements Tables\Contracts\HasTable
{
    use Tables\Concerns\InteractsWithTable;
    // ✅ Blade view
    protected string $view = 'filament.pages.best-selling-items';
   
    // ===============================
    // NAVIGATION
    // ===============================
    public static function getNavigationIcon(): ?string
    {
        return 'heroicon-o-chart-bar';
    }

    public static function getNavigationLabel(): string
    {
        return 'Best Selling Products';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'Product';
    }
    protected static ?int $navigationSort = 2;

    // ===============================
    // TABLE LOGIC
    // ===============================
    public function table(Table $table): Table
    {
        $user = Auth::user();

        return $table
            ->query(
                Product::query()
                    // 🔒 only products of current shop owner
                    ->whereHas('shop', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })

                    // 🔢 sum quantity only from COMPLETED orders
                    ->withSum([
                        'orderItems as total_sold' => function ($q) {
                            $q->whereHas('order', function ($q2) {
                                $q2->where('status', 'completed');
                            });
                        }
                    ], 'quantity')

                    // 🏆 sort from best selling to least
                    ->orderByDesc('total_sold')
            )
            ->columns([
                Tables\Columns\TextColumn::make('row_number')
                ->rowIndex()
                ->label('#'),
                Tables\Columns\TextColumn::make('name')
                    ->label('Product')
                    ->searchable(),

                Tables\Columns\TextColumn::make('total_sold')
                    ->label('Total Sold Quantity')
                    ->numeric(),
                    //->sortable(),

                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->money('MMK'),

                
            ]);
    }
                public static function canAccess(): bool
    {
        // return auth()->user()->shopApproved();
        return auth()->user()->shop?->status === 'approved';
    }

}
