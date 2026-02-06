<?php

namespace App\Filament\Pages;

use Filament\Forms;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class ShopSetup extends Page implements Forms\Contracts\HasForms
{
    use Forms\Concerns\InteractsWithForms;

    // ✅ Bind fields as public properties
    public $shop;
    public $name;
    public $phone;
    public $address;
    public $description;
    public $category;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-building-storefront';
    protected string $view = 'filament.pages.shop-setup';

    public function mount(): void
    {
        $this->shop = Auth::user()->shop;

        // Fill public properties with current shop data
        $this->name = $this->shop->name;
        $this->phone = $this->shop->phone;
        $this->address = $this->shop->address;
        $this->description = $this->shop->description;
        $this->category = $this->shop->category;
    }

    protected function getFormSchema(): array
    {
        return [
            TextInput::make('name')->required()->label('Name'),
            TextInput::make('phone')->required()->label('Phone'),
            TextInput::make('address')->required()->label('Address'),
            Textarea::make('description')->required()->label('Description'),
            TextInput::make('category')->required()->label('Category'),
        ];
    }

    public function submit(): void
    {
        // ✅ Get all form state (Livewire binds automatically)
        $data = [
            'name' => $this->name,
            'phone' => $this->phone,
            'address' => $this->address,
            'description' => $this->description,
            'category' => $this->category,
            'status'      => 'pending',
        ];

        // ✅ Update the shop model
        $this->shop->update($data);

        // ✅ Set status to pending
        $this->shop->update(['status' => 'pending']);

        // ✅ Flash message
        session()->flash('success', 'Shop info submitted! Waiting for admin approval.');

        // ✅ Redirect
        redirect()->to(config('filament.path') . 'admin'.'/waiting-approval');
    }
    public static function shouldRegisterNavigation(): bool
    {
        $user = Auth::user();

        if (!$user || !$user->isShopOwner()) {
            return false; // hide from admin
        }

        $shop = $user->shop;

        // Show only if no shop exists OR shop is in draft
        return $shop === null || $shop->status === 'draft';
    }
}
