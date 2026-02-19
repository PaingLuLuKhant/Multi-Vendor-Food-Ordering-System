<x-filament::page>

    @php
        $user = auth()->user();
        $shopIds = \App\Models\Shop::where('user_id', $user->id)->pluck('id');
        $deliveries = \App\Models\Delivery::all();
    @endphp

    @if($this->pendingOrders->isEmpty())
        <p class="no-pending">There are no pending orders right now.</p>
    @else
        <div class="table-wrapper">
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Products</th>
                        <th>Total Qty</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Assign Delivery</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($this->pendingOrders as $index => $order)
                        @php
                            $items = $order->orderItems
                                ->filter(
                                    fn($item) =>
                                    in_array($item->product->shop_id, $shopIds->toArray()) &&
                                    in_array($item->delivery_status, ['pending', 'assigned'])
                                );
                        @endphp
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $order->id }}</td>
                            <td>{{ $order->user->name }}</td>
                            <td>
                                <!-- {!! $items->map(fn($item) => $item->product->name . ' x ' . $item->quantity)->join('<br>') !!} -->
                                @foreach($items as $item)
                                    <div class="product-line">
                                        {{ $item->product->name }} x {{ $item->quantity }}
                                    </div>
                                @endforeach
                            </td>
                            <td>{{ $items->sum('quantity') }}</td>
                            <td>{{ number_format($items->sum(fn($item) => $item->price * $item->quantity)) }} MMK</td>
                            <!-- <td>
                                        @php
                                            $statuses = $items->pluck('delivery_status')->unique();
                                            $statusText = $statuses->map(fn($s) => $s === 'assigned' ? 'Delivery Assigned' : ucfirst($s))->join(', ');
                                            $statusColor = $statuses->contains('pending') ? '#f59e0b' : '#16a34a';
                                        @endphp
                                        <span style="padding:4px 8px; border-radius:4px; color:white; background-color:{{ $statusColor }};">
                                            {{ $statusText }}
                                        </span>
                                    </td> -->
                            <td>
                                @php
                                    $statuses = $items->pluck('delivery_status')->unique();
                                    $isPending = $statuses->contains('pending');
                                    $isAssigned = $statuses->contains('assigned');
                                @endphp

                                @if($isPending)
                                    <x-filament::badge color="warning">
                                        Pending
                                    </x-filament::badge>
                                @elseif($isAssigned)
                                    <x-filament::badge color="warning">
                                        Delivery Assigned
                                    </x-filament::badge>
                                @endif
                            </td>
                            <td>
                                @if($items->isNotEmpty())
                                    <button onclick="openAssignModal({{ $order->id }})" class="assign-btn">
                                        Assign
                                    </button>
                                @else
                                    -
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <!-- Modal -->
    <div id="assignModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
        background: rgba(0,0,0,0.4); align-items:center; justify-content:center;">
        <div style="background-color: #232222ef; padding:20px; border-radius:8px; width:300px; text-align:center;">
            <h3>Select Delivery Person</h3>
            <select id="deliverySelect"
                style="width:100%;background-color: #252d31; margin:10px 0; padding:6px; border-radius:4px;">
                <option value="">Select</option>
                @foreach($deliveries as $d)
                    <option value="{{ $d->id }}">{{ $d->name }} ({{ $d->area }})</option>
                @endforeach
            </select>
            <div style="margin-top:10px;">
                <button onclick="assignDelivery()"
                    style="padding:6px 12px; background:#16a34a; color:white; border:none; border-radius:4px;">Assign</button>
                <button onclick="closeAssignModal()"
                    style="padding:6px 12px; background:#dc2626; color:white; border:none; border-radius:4px; margin-left:5px;">Cancel</button>
            </div>
        </div>
    </div>

    <style>
        .styled-table td .fi-badge {
            white-space: nowrap;
        }


        .styled-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            table-layout: auto;
            /* VERY IMPORTANT */
            font-size: 13px;
        }

        .styled-table th,
        .styled-table td {
            padding: 10px 12px;
            vertical-align: top;
            /* top align */
        }

        .product-line {
            margin-bottom: 4px;
        }


        .product-line:last-child {
            margin-bottom: 0;
        }

        /* Dim white separator between rows */
        .styled-table tbody tr:not(:last-child) td {
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .table-wrapper {
            overflow-x: auto;
        }

        .styled-table {
            font-size: 15px;
            width: 100%;
            border-collapse: separate;
            font-family: sans-serif;
            background-color: #80808000;
            padding: 5px;
            border-spacing: 0;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .styled-table th,
        .styled-table td {
            padding: 15px 27px;
            border: #808080;
            text-align: left;
            background-color: #f3f4f60c;
        }

        .styled-table thead tr th:first-child {
            border-top-left-radius: 16px;
        }

        .styled-table thead tr th:last-child {
            border-top-right-radius: 16px;
        }

        .styled-table thead {
            border-radius: 30px;
            background-color: #64606027;
            color: #ffffff;
            font-weight: 600;
        }

        .assign-btn {
            padding: 6px 12px;
            background-color: #3b82f6;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .assign-btn:hover {
            background-color: #2563eb;
        }

        .styled-table th:nth-child(4),
        .styled-table td:nth-child(4) {
            /* 4th column = Products */
            width: 200px;
            /* adjust as needed */
            max-width: 300px;
            white-space: normal;
            /* allow wrapping */
            word-wrap: break-word;
        }

        .styled-table td:nth-child(2) {
            /* 4th column = Products */
            width: 50px;
            /* adjust as needed */
            max-width: 300px;
            white-space: normal;
            /* allow wrapping */
            word-wrap: break-word;
        }

        .styled-table td:nth-child(3) {
            /* 4th column = Products */
            width: 190px;
            /* adjust as needed */
            max-width: 300px;
            white-space: normal;
            /* allow wrapping */
            word-wrap: break-word;
        }

        .styled-table td:nth-child(5) {
            /* 4th column = Products */
            width: 70px;
            /* adjust as needed */
            max-width: 300px;
            white-space: normal;
            /* allow wrapping */
            word-wrap: break-word;
        }

        .styled-table td:nth-child(7) {
            /* 4th column = Products */
            width: 250px;
            /* adjust as needed */
            max-width: 300px;
            white-space: normal;
            /* allow wrapping */
            word-wrap: break-word;
        }

        /* Let row grow naturally */
        .styled-table tbody tr {
            height: auto;
        }

        /* Align all cells to top so multi-line looks correct */
        .styled-table td {
            vertical-align: top;
        }

        /* Better spacing between product lines */
        .styled-table td:nth-child(4) {
            line-height: 1.6;
        }


        td span {
            font-size: 0.875rem;
        }
    </style>

    <script>
        let currentOrderId = null;
        function openAssignModal(orderId) {
            currentOrderId = orderId;
            document.getElementById('assignModal').style.display = 'flex';
        }

        function closeAssignModal() {
            document.getElementById('assignModal').style.display = 'none';
            document.getElementById('deliverySelect').value = '';
        }

        function assignDelivery() {
            let deliveryId = document.getElementById('deliverySelect').value;
            if (!deliveryId || !currentOrderId) return;
            Livewire.emit('assignDelivery', currentOrderId, deliveryId);
            closeAssignModal();
        }
    </script>

</x-filament::page>
