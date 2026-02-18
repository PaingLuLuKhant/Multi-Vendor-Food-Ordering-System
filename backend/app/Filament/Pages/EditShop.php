<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use App\Models\Shop;
use BackedEnum;
use UnitEnum;
use Filament\Schemas\Concerns\InteractsWithSchemas;

class EditShop extends Page
{
    use InteractsWithSchemas;

    protected static ?string $navigationLabel = 'Edit Your Shop';
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

        // Load all shop data including hours
        $this->data = [
            'name'           => $this->shop->name,
            'category'       => $this->shop->category,
            'phone'          => $this->shop->phone,
            'description'    => $this->shop->description,
            'address'        => $this->shop->address,
            'open_time'      => $this->shop->open_time ?? '09:00',
            'close_time'     => $this->shop->close_time ?? '21:00',
            'is_closed_today' => $this->shop->is_closed_today ?? false,
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
                            ->label('Phone')
                            ->type('tel')  // <-- Fixed here
                            ->required(),

                        Textarea::make('description')
                            ->rows(3),

                        Textarea::make('address')
                            ->rows(2),
                    ]),

                Section::make('Shop Hours')
                    ->schema([
                        TextInput::make('open_time')
                            ->label('Open Time (HH:MM)')
                            ->placeholder('09:00')
                            ->required(),

                        TextInput::make('close_time')
                            ->label('Close Time (HH:MM)')
                            ->placeholder('21:00')
                            ->required(),

                        Toggle::make('is_closed_today')
                            ->label('Close Today')
                            ->helperText('If enabled, the shop will be closed today.'),
                    ]),
            ]);
    }


    public function save(): void
    {
        $this->shop->update([
            'name' => $this->data['name'],
            'category' => $this->data['category'],
            'phone' => $this->data['phone'],
            'description' => $this->data['description'],
            'address' => $this->data['address'],
            'open_time' => $this->data['open_time'] ?? '09:00',
            'close_time' => $this->data['close_time'] ?? '21:00',
            'is_closed_today' => $this->data['is_closed_today'] ?? false,
        ]);

        Notification::make()
            ->title('Shop updated successfully')
            ->success()
            ->send();
    }


    public static function canAccess(): bool
    {
        return auth()->user()->shop?->status === 'approved';
    }
}