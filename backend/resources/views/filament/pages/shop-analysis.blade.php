<x-filament::page>
    @php
        $activeShops = \App\Models\Shop::query()
            ->where('status', 'approved')
            ->withCount('products')
            ->whereHas('products')
            ->orderByDesc('products_count')
            ->orderBy('name')
            ->get();

        $inactiveShops = \App\Models\Shop::query()
            ->where('status', 'approved')
            ->withCount('products')
            ->doesntHave('products')
            ->orderBy('name')
            ->get();
    @endphp

    <style>
        .shop-analysis-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.5rem;
            align-items: start;
            margin-top: 1.5rem;
        }

        .shop-analysis-card {
            align-self: start;
            overflow: hidden;
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: 20px;
            background:
                radial-gradient(circle at top right, rgba(255, 255, 255, 0.75), transparent 40%),
                linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
            box-shadow:
                0 22px 45px -34px rgba(15, 23, 42, 0.45),
                0 14px 30px -28px rgba(15, 23, 42, 0.18);
        }

        .dark .shop-analysis-card {
            border-color: rgba(148, 163, 184, 0.24);
            background:
                radial-gradient(circle at top right, rgba(71, 85, 105, 0.28), transparent 38%),
                linear-gradient(180deg, #0f172a 0%, #111827 100%);
            box-shadow:
                0 22px 45px -34px rgba(2, 6, 23, 0.8),
                0 14px 30px -28px rgba(2, 6, 23, 0.55);
        }

        .shop-analysis-card__header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1rem;
            padding: 1.15rem 1.35rem 1rem;
            border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        }

        .dark .shop-analysis-card__header {
            border-bottom-color: rgba(148, 163, 184, 0.18);
        }

        .shop-analysis-card__title {
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.2;
            color: #0f172a;
        }

        .dark .shop-analysis-card__title {
            color: #f8fafc;
        }

        .shop-analysis-card__subtitle {
            margin-top: 0.35rem;
            font-size: 0.84rem;
            line-height: 1.45;
            color: #64748b;
        }

        .dark .shop-analysis-card__subtitle {
            color: #94a3b8;
        }

        .shop-analysis-card__badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 2.4rem;
            padding: 0.45rem 0.8rem;
            border-radius: 999px;
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
        }

        .shop-analysis-card__badge--active {
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
            color: #166534;
        }

        .shop-analysis-card__badge--inactive {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
        }

        .dark .shop-analysis-card__badge--active {
            background: linear-gradient(135deg, rgba(22, 101, 52, 0.35) 0%, rgba(34, 197, 94, 0.22) 100%);
            color: #bbf7d0;
            box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.18);
        }

        .dark .shop-analysis-card__badge--inactive {
            background: linear-gradient(135deg, rgba(127, 29, 29, 0.38) 0%, rgba(239, 68, 68, 0.2) 100%);
            color: #fecaca;
            box-shadow: inset 0 0 0 1px rgba(248, 113, 113, 0.18);
        }

        .shop-analysis-table-wrap {
            overflow-x: auto;
        }

        .shop-analysis-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
        }

        .shop-analysis-table thead th {
            padding: 0.9rem 1.35rem;
            text-align: left;
            font-size: 0.73rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #64748b;
            background: rgba(248, 250, 252, 0.92);
            border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        }

        .dark .shop-analysis-table thead th {
            color: #94a3b8;
            background: rgba(15, 23, 42, 0.75);
            border-bottom-color: rgba(148, 163, 184, 0.16);
        }

        .shop-analysis-table tbody tr {
            transition: background-color 0.18s ease;
        }

        .shop-analysis-table tbody tr:nth-child(even) {
            background: rgba(248, 250, 252, 0.72);
        }

        .shop-analysis-table tbody tr:hover {
            background: rgba(241, 245, 249, 0.96);
        }

        .dark .shop-analysis-table tbody tr:nth-child(even) {
            background: rgba(15, 23, 42, 0.36);
        }

        .dark .shop-analysis-table tbody tr:hover {
            background: rgba(30, 41, 59, 0.86);
        }

        .shop-analysis-table td {
            padding: 1rem 1.35rem;
            vertical-align: middle;
            border-bottom: 1px solid rgba(226, 232, 240, 0.9);
        }

        .dark .shop-analysis-table td {
            border-bottom-color: rgba(51, 65, 85, 0.9);
        }

        .shop-analysis-table tbody tr:last-child td {
            border-bottom: 0;
        }

        .shop-analysis-index {
            width: 4.5rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            color: #94a3b8;
        }

        .dark .shop-analysis-index {
            color: #64748b;
        }

        .shop-analysis-name {
            font-size: 0.96rem;
            font-weight: 700;
            line-height: 1.4;
            color: #0f172a;
        }

        .dark .shop-analysis-name {
            color: #f8fafc;
        }

        .shop-analysis-meta {
            margin-top: 0.18rem;
            font-size: 0.79rem;
            color: #64748b;
        }

        .dark .shop-analysis-meta {
            color: #94a3b8;
        }

        .shop-analysis-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            border-radius: 999px;
            padding: 0.38rem 0.72rem;
            white-space: nowrap;
            font-size: 0.78rem;
            font-weight: 700;
        }

        .shop-analysis-pill--success {
            background: rgba(220, 252, 231, 0.88);
            color: #166534;
        }

        .shop-analysis-pill--warning {
            background: rgba(255, 237, 213, 0.92);
            color: #9a3412;
        }

        .dark .shop-analysis-pill--success {
            background: rgba(22, 101, 52, 0.32);
            color: #bbf7d0;
        }

        .dark .shop-analysis-pill--warning {
            background: rgba(154, 52, 18, 0.3);
            color: #fdba74;
        }

        .shop-analysis-empty {
            padding: 2.75rem 1.5rem 2.5rem;
            text-align: center;
        }

        .shop-analysis-empty__title {
            font-size: 0.98rem;
            font-weight: 700;
            color: #0f172a;
        }

        .dark .shop-analysis-empty__title {
            color: #f8fafc;
        }

        .shop-analysis-empty__text {
            margin-top: 0.45rem;
            font-size: 0.85rem;
            line-height: 1.5;
            color: #64748b;
        }

        .dark .shop-analysis-empty__text {
            color: #94a3b8;
        }

        @media (max-width: 960px) {
            .shop-analysis-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

    {{-- Shop chart --}}
    <x-filament::card class="mb-6" style="width:700px;">
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

    {{-- Active Shops and Inactive Shops --}}
    <div class="shop-analysis-grid">
        <section class="shop-analysis-card">
            <div class="shop-analysis-card__header">
                <div>
                    <h3 class="shop-analysis-card__title">Active Shops</h3>
                    <p class="shop-analysis-card__subtitle">
                        Approved shops with published products that customers can browse and order from.
                    </p>
                </div>
                <span class="shop-analysis-card__badge shop-analysis-card__badge--active">
                    {{ $activeShops->count() }}
                </span>
            </div>

            @if($activeShops->isNotEmpty())
                <div class="shop-analysis-table-wrap">
                    <table class="shop-analysis-table">
                        <thead>
                            <tr>
                                <th style="width: 76px;">No.</th>
                                <th>Shop Name</th>
                                <th style="width: 150px;">Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($activeShops as $index => $shop)
                                <tr>
                                    <td class="shop-analysis-index">{{ $index + 1 }}</td>
                                    <td>
                                        <div class="shop-analysis-name">{{ $shop->name }}</div>
                                        <!-- <div class="shop-analysis-meta">Ready for browsing and checkout</div> -->
                                    </td>
                                    <td>
                                        <span class="shop-analysis-pill shop-analysis-pill--success">
                                            {{ $shop->products_count }} items
                                        </span>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="shop-analysis-empty">
                    <div class="shop-analysis-empty__title">No active shops yet</div>
                    <p class="shop-analysis-empty__text">
                        Approved shops will appear here once they add products to their menu.
                    </p>
                </div>
            @endif
        </section>

        <section class="shop-analysis-card">
            <div class="shop-analysis-card__header">
                <div>
                    <h3 class="shop-analysis-card__title">Inactive Shops</h3>
                    <p class="shop-analysis-card__subtitle">
                        Approved shops that still need menu items before they look complete to customers.
                    </p>
                </div>
                <span class="shop-analysis-card__badge shop-analysis-card__badge--inactive">
                    {{ $inactiveShops->count() }}
                </span>
            </div>

            @if($inactiveShops->isNotEmpty())
                <div class="shop-analysis-table-wrap">
                    <table class="shop-analysis-table">
                        <thead>
                            <tr>
                                <th style="width: 76px;">No.</th>
                                <th>Shop Name</th>
                                <th style="width: 180px;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($inactiveShops as $index => $shop)
                                <tr>
                                    <td class="shop-analysis-index">{{ $index + 1 }}</td>
                                    <td>
                                        <div class="shop-analysis-name">{{ $shop->name }}</div>
                                        <div class="shop-analysis-meta">Needs products to become customer-ready</div>
                                    </td>
                                    <td>
                                        <span class="shop-analysis-pill shop-analysis-pill--warning">
                                            Menu setup needed
                                        </span>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="shop-analysis-empty">
                    <div class="shop-analysis-empty__title">No inactive shops</div>
                    <p class="shop-analysis-empty__text">
                        Every approved shop currently has at least one product listed. That is a strong customer-facing signal.
                    </p>
                </div>
            @endif
        </section>
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
