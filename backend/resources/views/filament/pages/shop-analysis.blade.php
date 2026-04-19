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

    {{-- Active Shops (Left) and Inactive Shops (Right) Side by Side - Only Approved Shops --}}
    <div style="display: flex; gap: 20px; margin-top: 24px;">
        <!-- Left Side: Active Shops (Approved + Has Products) -->
        <div class="bg-white dark:bg-gray-800" style="flex: 1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #ffffff;">
            <div style="padding: 12px 16px; background: #f0fdf4; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-size: 14px; font-weight: 600; color: #15803d;">✅ Active Shops (Has Products)</h3>
                    <span style="background: #dcfce7; color: #166534; font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 9999px;">{{ \App\Models\Shop::where('status', 'approved')->whereHas('products')->count() }}</span>
                </div>
            </div>
            <div style="padding: 8px 0;">
                @foreach(\App\Models\Shop::where('status', 'approved')->whereHas('products')->get() as $shop)
                    <div style="padding: 8px 16px; font-size: 14px; border-bottom: 1px solid #e5e7eb;" class="text-gray-900 dark:text-gray-100 dark:border-gray-700">
                        {{ $shop->name }}
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Right Side: Inactive Shops (Approved + No Products) -->
        <div class="bg-white dark:bg-gray-800" style="flex: 1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #ffffff;">
            <div style="padding: 12px 16px; background: #fef2f2; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-size: 14px; font-weight: 600; color: #b91c1c;">❌ Inactive Shops (No Products)</h3>
                    <span style="background: #fee2e2; color: #991b1b; font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 9999px;">{{ \App\Models\Shop::where('status', 'approved')->doesntHave('products')->count() }}</span>
                </div>
            </div>
            <div style="padding: 8px 0;">
                @forelse(\App\Models\Shop::where('status', 'approved')->doesntHave('products')->get() as $shop)
                    <div style="padding: 8px 16px; font-size: 14px; border-bottom: 1px solid #e5e7eb;" class="text-gray-900 dark:text-gray-100 dark:border-gray-700">
                        {{ $shop->name }}
                    </div>
                @empty
                    <div style="padding: 16px; text-align: center; font-size: 14px;" class="text-gray-500 dark:text-gray-400">
                        No inactive shops found
                    </div>
                @endforelse
            </div>
        </div>
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