<x-filament::page>
    @php
        $activeUsers = \App\Models\User::query()
            ->withCount('orders')
            ->whereHas('orders')
            ->orderByDesc('orders_count')
            ->orderBy('name')
            ->get();

        $inactiveUsers = \App\Models\User::query()
            ->withCount('orders')
            ->doesntHave('orders')
            ->orderBy('name')
            ->get();
    @endphp

    <style>
        .user-analysis-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.5rem;
            align-items: start;
            margin-top: 1.5rem;
        }

        .user-analysis-card {
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

        .dark .user-analysis-card {
            border-color: rgba(148, 163, 184, 0.24);
            background:
                radial-gradient(circle at top right, rgba(71, 85, 105, 0.28), transparent 38%),
                linear-gradient(180deg, #0f172a 0%, #111827 100%);
            box-shadow:
                0 22px 45px -34px rgba(2, 6, 23, 0.8),
                0 14px 30px -28px rgba(2, 6, 23, 0.55);
        }

        .user-analysis-card__header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1rem;
            padding: 1.15rem 1.35rem 1rem;
            border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        }

        .dark .user-analysis-card__header {
            border-bottom-color: rgba(148, 163, 184, 0.18);
        }

        .user-analysis-card__title {
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.2;
            color: #0f172a;
        }

        .dark .user-analysis-card__title {
            color: #f8fafc;
        }

        .user-analysis-card__subtitle {
            margin-top: 0.35rem;
            font-size: 0.84rem;
            line-height: 1.45;
            color: #64748b;
        }

        .dark .user-analysis-card__subtitle {
            color: #94a3b8;
        }

        .user-analysis-card__badge {
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

        .user-analysis-card__badge--active {
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
            color: #166534;
        }

        .user-analysis-card__badge--inactive {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
        }

        .dark .user-analysis-card__badge--active {
            background: linear-gradient(135deg, rgba(22, 101, 52, 0.35) 0%, rgba(34, 197, 94, 0.22) 100%);
            color: #bbf7d0;
            box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.18);
        }

        .dark .user-analysis-card__badge--inactive {
            background: linear-gradient(135deg, rgba(127, 29, 29, 0.38) 0%, rgba(239, 68, 68, 0.2) 100%);
            color: #fecaca;
            box-shadow: inset 0 0 0 1px rgba(248, 113, 113, 0.18);
        }

        .user-analysis-table-wrap {
            overflow-x: auto;
        }

        .user-analysis-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
        }

        .user-analysis-table thead th {
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

        .dark .user-analysis-table thead th {
            color: #94a3b8;
            background: rgba(15, 23, 42, 0.75);
            border-bottom-color: rgba(148, 163, 184, 0.16);
        }

        .user-analysis-table tbody tr {
            transition: background-color 0.18s ease;
        }

        .user-analysis-table tbody tr:nth-child(even) {
            background: rgba(248, 250, 252, 0.72);
        }

        .user-analysis-table tbody tr:hover {
            background: rgba(241, 245, 249, 0.96);
        }

        .dark .user-analysis-table tbody tr:nth-child(even) {
            background: rgba(15, 23, 42, 0.36);
        }

        .dark .user-analysis-table tbody tr:hover {
            background: rgba(30, 41, 59, 0.86);
        }

        .user-analysis-table td {
            padding: 1rem 1.35rem;
            vertical-align: middle;
            border-bottom: 1px solid rgba(226, 232, 240, 0.9);
        }

        .dark .user-analysis-table td {
            border-bottom-color: rgba(51, 65, 85, 0.9);
        }

        .user-analysis-table tbody tr:last-child td {
            border-bottom: 0;
        }

        .user-analysis-index {
            width: 4.5rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            color: #94a3b8;
        }

        .dark .user-analysis-index {
            color: #64748b;
        }

        .user-analysis-name {
            font-size: 0.96rem;
            font-weight: 700;
            line-height: 1.4;
            color: #0f172a;
        }

        .dark .user-analysis-name {
            color: #f8fafc;
        }

        .user-analysis-meta {
            margin-top: 0.18rem;
            font-size: 0.79rem;
            color: #64748b;
        }

        .dark .user-analysis-meta {
            color: #94a3b8;
        }

        .user-analysis-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            border-radius: 999px;
            padding: 0.38rem 0.72rem;
            white-space: nowrap;
            font-size: 0.78rem;
            font-weight: 700;
        }

        .user-analysis-pill--success {
            background: rgba(220, 252, 231, 0.88);
            color: #166534;
        }

        .user-analysis-pill--warning {
            background: rgba(255, 237, 213, 0.92);
            color: #9a3412;
        }

        .dark .user-analysis-pill--success {
            background: rgba(22, 101, 52, 0.32);
            color: #bbf7d0;
        }

        .dark .user-analysis-pill--warning {
            background: rgba(154, 52, 18, 0.3);
            color: #fdba74;
        }

        .user-analysis-empty {
            padding: 2.75rem 1.5rem 2.5rem;
            text-align: center;
        }

        .user-analysis-empty__title {
            font-size: 0.98rem;
            font-weight: 700;
            color: #0f172a;
        }

        .dark .user-analysis-empty__title {
            color: #f8fafc;
        }

        .user-analysis-empty__text {
            margin-top: 0.45rem;
            font-size: 0.85rem;
            line-height: 1.5;
            color: #64748b;
        }

        .dark .user-analysis-empty__text {
            color: #94a3b8;
        }

        @media (max-width: 960px) {
            .user-analysis-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

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

    {{-- Active Users and Inactive Users --}}
    <div class="user-analysis-grid">
        <section class="user-analysis-card">
            <div class="user-analysis-card__header">
                <div>
                    <h3 class="user-analysis-card__title">Active Users</h3>
                    <p class="user-analysis-card__subtitle">
                        Users who have already placed at least one order and are actively engaging with the platform.
                    </p>
                </div>
                <span class="user-analysis-card__badge user-analysis-card__badge--active">
                    {{ $activeUsers->count() }}
                </span>
            </div>

            @if($activeUsers->isNotEmpty())
                <div class="user-analysis-table-wrap">
                    <table class="user-analysis-table">
                        <thead>
                            <tr>
                                <th style="width: 76px;">No.</th>
                                <th>User</th>
                                <th style="width: 150px;">Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($activeUsers as $index => $user)
                                <tr>
                                    <td class="user-analysis-index">{{ $index + 1 }}</td>
                                    <td>
                                        <div class="user-analysis-name">{{ $user->name }}</div>
                                        <div class="user-analysis-meta">{{ $user->email }}</div>
                                    </td>
                                    <td>
                                        <span class="user-analysis-pill user-analysis-pill--success">
                                            {{ $user->orders_count }} orders
                                        </span>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="user-analysis-empty">
                    <div class="user-analysis-empty__title">No active users yet</div>
                    <p class="user-analysis-empty__text">
                        Users will appear here once they place their first order on the platform.
                    </p>
                </div>
            @endif
        </section>

        <section class="user-analysis-card">
            <div class="user-analysis-card__header">
                <div>
                    <h3 class="user-analysis-card__title">Inactive Users</h3>
                    <p class="user-analysis-card__subtitle">
                        Registered users who have not placed any order yet and may need onboarding or re-engagement.
                    </p>
                </div>
                <span class="user-analysis-card__badge user-analysis-card__badge--inactive">
                    {{ $inactiveUsers->count() }}
                </span>
            </div>

            @if($inactiveUsers->isNotEmpty())
                <div class="user-analysis-table-wrap">
                    <table class="user-analysis-table">
                        <thead>
                            <tr>
                                <th style="width: 76px;">No.</th>
                                <th>User</th>
                                <th style="width: 180px;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($inactiveUsers as $index => $user)
                                <tr>
                                    <td class="user-analysis-index">{{ $index + 1 }}</td>
                                    <td>
                                        <div class="user-analysis-name">{{ $user->name }}</div>
                                        <div class="user-analysis-meta">{{ $user->email }}</div>
                                    </td>
                                    <td>
                                        <span class="user-analysis-pill user-analysis-pill--warning">
                                            No orders yet
                                        </span>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="user-analysis-empty">
                    <div class="user-analysis-empty__title">No inactive users</div>
                    <p class="user-analysis-empty__text">
                        Every registered user has already placed at least one order. That is a healthy engagement sign.
                    </p>
                </div>
            @endif
        </section>
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
