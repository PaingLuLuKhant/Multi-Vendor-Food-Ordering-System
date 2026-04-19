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

    {{-- ADD THIS: Active Users (Left) and Inactive Users (Right) Side by Side --}}
    <div style="display: flex; gap: 20px; margin-top: 24px;">
        <!-- Left Side: Active Users (Has at least 1 order) -->
        <div class="bg-white dark:bg-gray-800" style="flex: 1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #ffffff;">
            <div style="padding: 12px 16px; background: #f0fdf4; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-size: 14px; font-weight: 600; color: #15803d;">✅ Active Users (Has Orders)</h3>
                    <span style="background: #dcfce7; color: #166534; font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 9999px;">{{ \App\Models\User::whereHas('orders')->count() }}</span>
                </div>
            </div>
            <div style="padding: 8px 0;">
                @foreach(\App\Models\User::whereHas('orders')->get() as $user)
                    <div style="padding: 8px 16px; font-size: 14px; border-bottom: 1px solid #e5e7eb;" class="text-gray-900 dark:text-gray-100 dark:border-gray-700">
                        {{ $user->name }}
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Right Side: Inactive Users (No orders) -->
        <div class="bg-white dark:bg-gray-800" style="flex: 1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #ffffff;">
            <div style="padding: 12px 16px; background: #fef2f2; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-size: 14px; font-weight: 600; color: #b91c1c;">❌ Inactive Users (No Orders)</h3>
                    <span style="background: #fee2e2; color: #991b1b; font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 9999px;">{{ \App\Models\User::doesntHave('orders')->count() }}</span>
                </div>
            </div>
            <div style="padding: 8px 0;">
                @forelse(\App\Models\User::doesntHave('orders')->get() as $user)
                    <div style="padding: 8px 16px; font-size: 14px; border-bottom: 1px solid #e5e7eb;" class="text-gray-900 dark:text-gray-100 dark:border-gray-700">
                        {{ $user->name }}
                    </div>
                @empty
                    <div style="padding: 16px; text-align: center; font-size: 14px;" class="text-gray-500 dark:text-gray-400">
                        No inactive users found
                    </div>
                @endforelse
            </div>
        </div>
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