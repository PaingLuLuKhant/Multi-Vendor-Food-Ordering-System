<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use App\Models\Shop;
use BackedEnum;
use UnitEnum;
use Filament\Schemas\Concerns\InteractsWithSchemas;


class EditShop extends Page
{
    use InteractsWithSchemas;
    protected static ?string $navigationLabel = 'Edit Shop';
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-pencil-square';
    protected static string|UnitEnum|null $navigationGroup = 'Shop';

    protected string $view = 'filament.pages.edit-shop';

    public Shop $shop;

    public array $data = [];

    public static function shouldRegisterNavigation(): bool
    {
        return true; 
    }

    public function mount(): void
    {
        $this->shop = Shop::where('user_id', auth()->id())->firstOrFail();

        $this->data = [
            'name'        => $this->shop->name,
            'category'    => $this->shop->category,
            'phone'       => $this->shop->phone,
            'description' => $this->shop->description,
            'address'     => $this->shop->address,
        ];
    }

    public function schema(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make('Shop Details')
                    ->schema([
                        TextInput::make('name')
                            ->label('Shop Name')
                            ->required(),

                        TextInput::make('category')
                            ->required(),

                        TextInput::make('phone')
                            ->tel()
                            ->required(),

                        Textarea::make('description')
                            ->rows(3),

                        Textarea::make('address')
                            ->rows(2),
                    ]),
            ]);
    }


    public function save(): void
    {
        $this->shop->update($this->data);

        Notification::make()
            ->title('Shop updated successfully')
            ->success()
            ->send();
    }
    public static function canAccess(): bool
    {
        // return auth()->user()->shopApproved();
        return auth()->user()->shop?->status === 'approved';
    }

}