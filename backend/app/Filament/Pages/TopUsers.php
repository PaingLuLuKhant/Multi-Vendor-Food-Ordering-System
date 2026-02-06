<?php
namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Contracts\HasTable;
use App\Models\User;
use BackedEnum;
use UnitEnum;

class TopUsers extends Page implements HasTable
{
    use Tables\Concerns\InteractsWithTable;

    protected static string|UnitEnum|null $navigationGroup = 'User';
    protected static ?string $navigationLabel = 'Top Customers';
    protected static ?int $navigationSort = 3;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-star';
    protected string $view = 'filament.pages.top-users';

    public static function shouldRegisterNavigation(): bool
    {
        return auth()->user()?->role === 'admin';
    }

    // Table query: users with most orders
    protected function getTableQuery()
    {
        return User::query()
            ->withCount('orders')
            ->orderByDesc('orders_count')
            ->limit(15);
    }

    // Columns for the table
    protected function getTableColumns(): array
    {
        return [
            TextColumn::make('row_number')
                ->rowIndex()
                ->label('#'),

            TextColumn::make('name')
                ->label('User Name')
                ->sortable(),

            TextColumn::make('email')
                ->label('Email'),

            TextColumn::make('orders_count')
                ->label('Total Orders')
                ->sortable(),
        ];
    }

    // Disable pagination
    protected function isTablePaginationEnabled(): bool
    {
        return false;
    }

    // Get table records
    public function getTableRecords(): \Illuminate\Support\Collection
    {
        return $this->getTableQuery()->get();
    }

    // No bulk actions
    protected function getTableBulkActions(): array
    {
        return [];
    }
}
