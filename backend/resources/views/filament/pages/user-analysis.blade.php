<x-filament::page>
    {{-- Chart --}}
    <x-filament::card class="mb-6" style="width:700px;">
        <h3 class="text-md font-semibold mb-4 text-center">
            Users (Last 12 Months)
        </h3>

        <div style="height: 400px;">
            <canvas id="userChart"></canvas>
        </div>
    </x-filament::card>

    {{-- Stats UNDER the chart --}}
    <div class="mt-6">
        @livewire(\App\Filament\Widgets\UserInsights::class)
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const ctx = document.getElementById('userChart').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: @json($this->getUserChartData()),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    </script>
</x-filament::page>
