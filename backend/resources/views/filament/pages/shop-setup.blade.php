<x-filament::page>
    <form wire:submit.prevent="submit">
        {{ $this->form }}

        <div style="margin-top: 20px;">
            <x-filament::button type="submit">
                Submit for Approval
            </x-filament::button>
        </div>
    </form>

    @if(session()->has('success'))
        <div class="text-green-600 mt-4">{{ session('success') }}</div>
    @endif
</x-filament::page>
