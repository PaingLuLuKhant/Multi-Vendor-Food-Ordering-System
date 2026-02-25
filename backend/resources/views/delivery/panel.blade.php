<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Delivery Panel</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            margin: 0;
            padding: 0;
        }

        .header {
            background: #6b1511;
            color: white;
            padding: 16px 24px;
            font-size: 20px;
        }

        .container {
            padding: 24px;
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        .card {
            background: white;
            border-radius: 10px;
            padding: 18px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .card h3 {
            margin: 0 0 6px 0;
            font-size: 18px;
        }

        .card p {
            margin: 4px 0;
            font-size: 14px;
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            color: white;
        }

        .pending {
            background: #f59e0b;
        }

        .assigned {
            background: #33c9f7;
        }

        .completed {
            background: #16a34a;
        }

        .actions {
            margin-top: 12px;
        }

        button {
            width: 100%;
            padding: 10px;
            background: #6b1511;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        }

        button:hover {
            background: #15803d;
        }

        .empty {
            text-align: center;
            color: #666;
            margin-top: 40px;
        }
    </style>
</head>

<body>

    <!-- <div class="header">
        🚚 Delivery Panel
    </div> -->
    <div class="header" style="display: flex; justify-content: space-between; align-items: center;">
    <span>🚚 Delivery Panel</span>
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit" style="
            background: #fff;
            color: #6b1511;
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 14px;
        ">
            Logout
        </button>
    </form>
</div>

    <div class="container">
        <h2>My Assigned Orders</h2>

        @if($orderItems->isEmpty())
            <div class="empty">
                No assigned orders right now.
            </div>
        @else
            <div class="cards">
                @foreach($orderItems->groupBy(fn($item) => $item->order->id) as $orderId => $items)
                    <div class="card">
                        <h3>Order #{{ $orderId }}</h3>
                        <p><strong>Customer Name:</strong> {{ $items->first()->order->user->name }}</p>
                        <p><strong>Customer Phone:</strong> {{ $items->first()->order->customer_phone }}</p>
                        <p><strong>Customer Address:</strong> {{ $items->first()->order->customer_address }}</p>

                        

                        <p><strong>Shop Name:</strong> {{ $items->first()->product->shop->name }}</p>
                        <p><strong>Shop Phone:</strong> {{ $items->first()->product->shop->phone }}</p>
                        <p><strong>Shop Address:</strong> {{ $items->first()->product->shop->address }}</p>

                        <p>
                            <strong>Products:</strong>
                            {{ $items->map(fn($item) => $item->product->name . ' (x' . $item->quantity . ')')->join(', ') }}
                        </p>
                        <p><strong>Amount :</strong> MMK {{ number_format($items->first()->order->total_amount) }}</p>


                        <p>
                            <strong>Status:</strong>
                            @php
                                $statuses = $items->pluck('delivery_status')->unique();
                            @endphp
                            @foreach($statuses as $status)
                                <span class="badge {{ $status }}">
                                    {{ ucfirst($status) }}
                                </span>
                            @endforeach
                        </p>

                        {{-- Only show button if any item is assigned --}}
                        @if($items->contains(fn($i) => $i->delivery_status === 'assigned'))
                            <div class="actions">
                                <form method="POST" action="{{ url('/deli/' . $orderId . '/delivered') }}">
                                    @csrf
                                    <button type="submit">
                                        Mark Completed
                                    </button>
                                </form>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif
    </div>




</body>

</html>