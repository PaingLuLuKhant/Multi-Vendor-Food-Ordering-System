<x-filament::page>
    

    {{-- Shop chart --}}
    <x-filament::card class="mb-6"  style="width:700px;">
        <h3 class="text-md font-semibold mb-4 text-center">
            Shops (Last 12 Months)
        </h3>

        <div style="height: 400px;">
            <canvas id="shopChart"></canvas>
        </div>
    </x-filament::card>

    {{-- Stats UNDER the chart --}}
    <div class="mt-6">
        @livewire(\App\Filament\Widgets\ShopInsights::class)
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const ctx = document.getElementById('shopChart').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: @json($this->getShopChartData()),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 2,
                            precision: 0
                        }
                    }
                }
            }
        });
    </script>
</x-filament::page>
