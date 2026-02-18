<x-filament::page>
    <x-filament::card>
        <p><strong>Name:</strong> {{ $shop->name }}</p><br>
        <p><strong>Category:</strong> {{ $shop->category }}</p><br>
        <p><strong>Phone:</strong> {{ $shop->phone }}</p><br>
        <p><strong>Address:</strong> {{ $shop->address }}</p><br>
        <p><strong>Description:</strong> {{ $shop->description }}</p><br>
    </x-filament::card>

    <x-filament::card class="mt-6">
    <h3 class="text-lg font-bold mb-3">Customer Ratings</h3>

    @if ($shop->ratings->count())
        <p>
            <strong>Average Rating:</strong>
            ⭐️ {{ number_format($shop->ratings->avg('rating'), 1) }}
            ({{ $shop->ratings->count() }} ratings)
        </p>

        <br>

        @foreach ($shop->ratings as $rating)
            ⭐️ {{ $rating->rating }}
            — {{ $rating->user->name }}
            <br>
        @endforeach
    @else
        <p class="text-gray-500">No ratings yet.</p>
    @endif
</x-filament::card>



</x-filament::page>