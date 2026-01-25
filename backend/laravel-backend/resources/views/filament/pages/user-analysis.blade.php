<x-filament::page class="overflow-hidden">
    <h2 class="text-lg font-bold mb-6 text-center w-full">User Analysis Dashboard</h2>

    <!-- ===== USER CHART (half width for future expansion) ===== -->
    <div class="flex gap-4 flex-wrap justify-start">
        <div class="flex-none w-full sm:w-[48%]">
            <x-filament::card style="width: 600px;">
                <h3 class="text-md font-semibold mb-4 text-center">Users (Last 12 Months)</h3>
                <div style="width: 100%; height: 400px;">
                    <canvas id="userChart"></canvas>
                </div>
            </x-filament::card>
        </div>

        <!-- Empty space for future chart -->
        <div class="flex-none w-full sm:w-[48%]"></div>
    </div>

<!-- Insight Cards below chart (vertical stacked) -->
<div class="mt-6">
    <!-- Total Users -->
    <x-filament::card class="mb-4">
        <h3 class="text-sm font-semibold mb-2">Total Users</h3>
        <p class="text-2xl font-bold">{{ \App\Models\User::count() }}</p>
    </x-filament::card>

    <!-- New Users -->
    <x-filament::card class="mb-4">
        <h3 class="text-sm font-semibold mb-2">New Users (This Month)</h3>
        <p class="text-2xl font-bold">{{ \App\Models\User::whereMonth('created_at', now()->month)->count() }}</p>
    </x-filament::card>

    <!-- Active Users -->
    <x-filament::card class="mb-4">
        <h3 class="text-sm font-semibold mb-2">Active Users</h3>
        <p class="text-2xl font-bold">
            {{ \App\Models\User::whereHas('orders')->count() }}
        </p>
    </x-filament::card>
</div>
    <!-- USER GROWTH CHART -->


<!-- Chart.js Script -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
    // User Chart (line)
    const ctx = document.getElementById('userChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: @json($this->getUserChartData()),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true, precision: 0 } }
        }
    });



</script>

</x-filament::page>
