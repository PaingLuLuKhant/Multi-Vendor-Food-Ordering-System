<x-filament::page class="overflow-hidden">
    <h2 class="text-lg font-bold mb-6 text-center w-full">Shop Categories</h2>

    <div class="flex justify-center">
        <x-filament::card style="width: 700px;">
            <h3 class="text-md font-semibold mb-4 text-center">Shops by Category</h3>
            <!-- Fixed height container -->
            <div style="width:100%; height:400px;">
                <canvas id="shopCategoryChart"></canvas>
            </div>
        </x-filament::card>
    </div>

    <!-- Chart.js v4 -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

    <script>
        Chart.register(ChartDataLabels);

        const ctx = document.getElementById('shopCategoryChart').getContext('2d');

        const chartData = {
            labels: ['Myanmar Food','Chinese Food','Thai Cuisine','Fast Foods','Italian Food','Seafood','Japanese Food','Vegan'],
            datasets: [{
                data: [5, 3, 7, 2, 4, 1, 2, 3],
                backgroundColor: [
                    '#f59e0b','#3b82f6','#10b981','#ef4444',
                    '#8b5cf6','#14b8a6','#f43f5e','#eab308'
                ],
            }]
        };

        new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: 20 // reduces margin around pie
                },
                plugins: {
                    legend: { display: true, position: 'bottom' },
                    datalabels: {
                        color: '#fff',
                        font: { weight: 'bold', size: 14 },
                        formatter: (value, context) => context.chart.data.labels[context.dataIndex],
                        anchor: 'center', // center inside slice
                        align: 'center'
                    }
                },
                radius: '95%', // <-- make the pie fill almost the whole canvas
                cutout: 0      // <-- full pie, not donut
            }
        });
    </script>
</x-filament::page>
