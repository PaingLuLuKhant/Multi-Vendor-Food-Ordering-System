<x-filament::page class="overflow-hidden">
    <h2 class="text-lg font-bold mb-6 text-center w-full">Shop Analysis Dashboard</h2>

    <!-- ===== SHOP CHART ===== -->
    <div class="flex gap-4 flex-wrap justify-start">
        <div class="flex-none w-full sm:w-[48%]">
            <x-filament::card style="width: 600px;">
                <h3 class="text-md font-semibold mb-4 text-center">Shops (Last 12 Months)</h3>
                <div style="width: 100%; height: 400px;">
                    <canvas id="shopChart"></canvas>
                </div>
            </x-filament::card>
        </div>

        <!-- Empty space for future chart -->
        <div class="flex-none w-full sm:w-[48%]"></div>
    </div>

    <!-- Insight Cards below chart -->
    <div class="mt-6">
        <!-- Total Shops -->
        <x-filament::card class="mb-4">
            <h3 class="text-sm font-semibold mb-2">Total Shops</h3>
            <p class="text-2xl font-bold">{{ \App\Models\Shop::count() }}</p>
        </x-filament::card>

        <!-- New Shops -->
        <x-filament::card class="mb-4">
            <h3 class="text-sm font-semibold mb-2">New Shops (This Month)</h3>
            <p class="text-2xl font-bold">{{ \App\Models\Shop::whereMonth('created_at', now()->month)->count() }}</p>
        </x-filament::card>

        <!-- Active Shops (with at least one product) -->
        <x-filament::card class="mb-4">
            <h3 class="text-sm font-semibold mb-2">Active Shops</h3>
            <p class="text-2xl font-bold">
                {{ \App\Models\Shop::whereHas('products')->count() }}
            </p>
        </x-filament::card>
    </div>

    <!-- Chart.js Script -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const ctx = document.getElementById('shopChart').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: @json($this->getShopChartData()),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true }
                },
                scales: {
                    y: {
                beginAtZero: true,
                max: 10,           // <-- Force Y-axis max to 10
                ticks: {
                    stepSize: 2,   // <-- 0,2,4,6,8,10
                    precision: 0
                }
            }
                }
            }
        });
    </script>
</x-filament::page>
