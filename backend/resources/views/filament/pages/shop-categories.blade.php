<x-filament::page class="overflow-hidden">

    <div class="flex justify-center">
        <x-filament::card style="width: 650px;">
            <h3 class="text-md font-semibold mb-4 text-center">Number of Shops by Category</h3>
            <!-- Fixed height container -->
            <div style="width:100%; height:550px;">
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

        // Fetch real data from PHP
        const chartData = @json($this->getCategoryChartData());

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.labels,       // labels from DB
                datasets: [{
                    data: chartData.data,       // numbers from DB
                    backgroundColor: [
                        '#f59e0b', '#3b82f6', '#10b981', '#ef4444',
                        '#8b5cf6', '#14b8a6', '#f43f5e', '#eab308'
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: 20
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#4bb543', // legend text color
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        font: { weight: 'bold', size: 18 },
                        formatter: (value) => value, // show only number inside slice
                        anchor: 'center',
                        align: 'center',
                        textStrokeColor: '#000',
                        textStrokeWidth: 2
                    }
                },
                radius: '95%',
                cutout: 0
            }
        });
    </script>

</x-filament::page>
