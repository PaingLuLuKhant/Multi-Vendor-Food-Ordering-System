<x-filament::page>
    @php
        $user = auth()->user();
        $shopIds = \App\Models\Shop::where('user_id', $user->id)->pluck('id');
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
                        $items = $order->orderItems->filter(fn($item) => $item->product && in_array($item->product->shop_id, $shopIds->toArray()));
                    @endphp
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $order->id }}</td>
                        <td>{{ $order->user->name ?? 'Unknown' }}</td>

                        <!-- PRODUCTS -->
                        <td>
                            @foreach($items as $item)
                                <div class="product-line">{{ $item->product->name }} x {{ $item->quantity }}</div>
                            @endforeach
                        </td>

                        <!-- TOTAL QTY -->
                        <td>{{ $items->sum('quantity') }}</td>

                        <!-- TOTAL PRICE -->
                        <td>{{ number_format($items->sum(fn($item) => $item->price * $item->quantity)) }} MMK</td>

                        <!-- STATUS -->
                        <td>
                            @if($order->delivery_status == 'pending')
                                <x-filament::badge color="warning">Pending</x-filament::badge>
                            @elseif($order->delivery_status == 'assigned')
                                <x-filament::badge color="info">Assigned to {{ $order->delivery->name ?? 'Delivery' }}</x-filament::badge>
                            @elseif($order->delivery_status == 'partial')
                                <x-filament::badge color="warning">Partially Assigned</x-filament::badge>
                            @elseif($order->delivery_status == 'delivered')
                                <x-filament::badge color="success">Delivered</x-filament::badge>
                            @endif
                        </td>

                        <!-- ASSIGN BUTTON -->
                        <td>
                            @if(!$order->my_shop_assigned && ($order->delivery_status == 'pending' || $order->delivery_status == 'partial'))
                                <button type="button" onclick="openAssignModal({{ $order->id }})" class="assign-btn">Assign</button>
                            @elseif($order->my_shop_assigned)
                                <span style="color: #16a34a;">✓ Assigned</span>
                            @else
                                <span>-</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <!-- MODAL -->
    <div id="assignModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:99999;" wire:ignore>
        <div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
            <div class="modal-content">
                <h3 class="modal-title">Select Delivery Person</h3>
                <select id="deliverySelect" class="modal-select">
                    <option value="">-- Select --</option>
                </select>
                <div class="modal-buttons">
                    <button type="button" onclick="assignDelivery()" class="modal-btn-primary">Assign</button>
                    <button type="button" onclick="closeAssignModal()" class="modal-btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <style>
        .table-wrapper {
            overflow-x: auto;
        }
        .styled-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        .styled-table th,
        .styled-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .styled-table thead {
            background-color: #f3f4f6;
            font-weight: 600;
        }
        .dark .styled-table thead {
            background-color: #1f2937;
        }
        .dark .styled-table td {
            border-bottom-color: #374151;
        }
        .product-line {
            margin-bottom: 4px;
        }
        .product-line:last-child {
            margin-bottom: 0;
        }
        .assign-btn {
            padding: 6px 12px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .assign-btn:hover {
            background-color: #2563eb;
        }
        .no-pending {
            text-align: center;
            padding: 40px;
            color: #6b7280;
        }

        /* Modal Styles */
        .modal-content {
            background-color: #ffffff;
            padding: 24px;
            border-radius: 12px;
            width: 360px;
            text-align: center;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .dark .modal-content {
            background-color: #1f2937;
            border: 1px solid #374151;
        }
        .modal-title {
            margin-bottom: 16px;
            font-size: 18px;
            font-weight: 600;
            color: #111827;
        }
        .dark .modal-title {
            color: #f3f4f6;
        }
        .modal-select {
            width: 100%;
            padding: 10px 12px;
            margin: 10px 0;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            background-color: #ffffff;
            color: #111827;
            font-size: 14px;
        }
        .dark .modal-select {
            background-color: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
        }
        .modal-select option {
            background-color: #ffffff;
            color: #111827;
        }
        .dark .modal-select option {
            background-color: #374151;
            color: #f3f4f6;
        }
        .modal-buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .modal-btn-primary {
            padding: 8px 20px;
            background-color: #10b981;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        .modal-btn-primary:hover {
            background-color: #059669;
        }
        .modal-btn-secondary {
            padding: 8px 20px;
            background-color: #ef4444;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        .modal-btn-secondary:hover {
            background-color: #dc2626;
        }
    </style>

    <script>
        let currentOrderId = null;
        let isLoadingOptions = false;

        function openAssignModal(orderId) {
            if (isLoadingOptions) return;

            currentOrderId = orderId;
            const modal = document.getElementById('assignModal');
            modal.style.display = 'block';
            isLoadingOptions = true;

            @this.call('getDeliveryOptionsForOrder', orderId).then(options => {
                const select = document.getElementById('deliverySelect');
                select.innerHTML = '<option value="">-- Select --</option>';
                if (options.length === 0) {
                    select.innerHTML = '<option value="">No delivery persons available</option>';
                } else {
                    options.forEach(option => {
                        select.innerHTML += `<option value="${option.id}">${option.name} (${option.area})</option>`;
                    });
                }
                select.value = '';
                isLoadingOptions = false;
            }).catch(() => {
                isLoadingOptions = false;
            });
        }

        function closeAssignModal() {
            const modal = document.getElementById('assignModal');
            modal.style.display = 'none';
            document.getElementById('deliverySelect').value = '';
            currentOrderId = null;
        }

        function assignDelivery() {
            const deliveryId = document.getElementById('deliverySelect').value;
            if (!deliveryId || !currentOrderId) {
                alert('Please select a delivery person');
                return;
            }
            @this.call('assignDelivery', currentOrderId, deliveryId);
            closeAssignModal();
        }
    </script>
</x-filament::page>