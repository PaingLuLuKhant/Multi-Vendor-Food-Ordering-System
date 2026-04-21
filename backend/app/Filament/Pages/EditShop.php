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
use Filament\Forms\Components\FileUpload;
use Illuminate\Support\Facades\Storage;
use Livewire\WithFileUploads;

class EditShop extends Page
{
    use InteractsWithSchemas;
    use WithFileUploads; // Add this trait

    protected static ?string $navigationLabel = 'Edit Your Shop';
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-pencil-square';
    protected static string|UnitEnum|null $navigationGroup = 'Shop';

    protected static ?int $navigationSort = 3;

    protected string $view = 'filament.pages.edit-shop';

    public Shop $shop;
    public array $data = [];
    public $image; // Separate property for image upload

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

        // Load existing image if any
        if ($this->shop->image) {
            $this->image = $this->shop->image;
        }
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
                            ->label('Category')
                            ->required(),

                        TextInput::make('phone')
                            ->label('Phone')
                            ->type('tel')
                            ->required(),

                        Textarea::make('description')
                            ->label('Description')
                            ->rows(3),

                        Textarea::make('address')
                            ->label('Address')
                            ->rows(2),

                        // FILE UPLOAD - Separate from data array
                        FileUpload::make('image')
                            ->label('Shop Image')
                            ->image()
                            ->imageEditor()
                            ->directory('shops')
                            ->visibility('public')
                            ->maxSize(2048)
                            ->helperText('Upload a shop logo or image (max 2MB)')
                            ->columnSpanFull(),
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
                            ->label('Closed Today')
                            ->helperText('If enabled, the shop will be closed today.'),
                    ]),
            ]);
    }

    public function save(): void
    {
        // Prepare update data
        $updateData = [
            'name' => $this->data['name'],
            'category' => $this->data['category'],
            'phone' => $this->data['phone'],
            'description' => $this->data['description'],
            'address' => $this->data['address'],
            'open_time' => $this->data['open_time'] ?? '09:00',
            'close_time' => $this->data['close_time'] ?? '21:00',
            'is_closed_today' => $this->data['is_closed_today'] ?? false,
        ];

        // Handle image upload properly
        if ($this->image) {
            // If it's a new uploaded file (Livewire temporary file)
            if (is_object($this->image) && method_exists($this->image, 'store')) {
                $updateData['image'] = $this->image->store('shops', 'public');
            }
            // If it's an existing image path string
            elseif (is_string($this->image) && !str_contains($this->image, 'livewire-tmp')) {
                $updateData['image'] = $this->image;
            }
            // If it's a temporary Livewire file, store it
            elseif (is_string($this->image) && str_contains($this->image, 'livewire-tmp')) {
                // This shouldn't happen with proper FileUpload component
                $updateData['image'] = $this->image;
            }
        }

        // Update the shop
        $this->shop->update($updateData);

        Notification::make()
            ->title('Shop updated successfully')
            ->success()
            ->send();

        // Refresh the page or redirect
        $this->redirect(request()->header('Referer'));
    }

    public static function canAccess(): bool
    {
        return auth()->user()->shop?->status === 'approved';
    }
}
