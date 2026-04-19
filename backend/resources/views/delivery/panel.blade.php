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
            display: flex;
            justify-content: space-between;
            align-items: center;
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
        }

        .badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            color: white;
        }

        .pending { background: #f59e0b; }
        .assigned { background: #33c9f7; }
        .completed { background: #16a34a; }

        button {
            width: 100%;
            padding: 10px;
            background: #6b1511;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        button:hover {
            background: #15803d;
        }

        .empty {
            text-align: center;
            margin-top: 40px;
        }
    </style>
</head>

<body>

<div class="header">
    <span>🚚 Delivery Panel</span>
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit" style="background:white;color:#6b1511;">
            Logout
        </button>
    </form>
</div>

<div class="container">
    <h2>My Assigned Orders</h2>

    @if($orders->isEmpty())
        <div class="empty">No assigned orders right now.</div>
    @else
        <div class="cards">

            @foreach($orders as $order)
                <div class="card">

                    <h3>Order #{{ $order->id }}</h3>

                    <!-- CUSTOMER -->
                    <p><strong>Name:</strong> {{ $order->user->name }}</p>
                    <p><strong>Phone:</strong> {{ $order->customer_phone }}</p>
                    <p><strong>Address:</strong> {{ $order->customer_address }}</p>

                    <!-- PRODUCTS WITH SHOP NAME -->
                    <p><strong>Products:</strong></p>
                    @foreach($order->orderItems as $item)
                        <div>
                            {{ $item->product->name }} (x{{ $item->quantity }}) - {{ $item->product->shop->name ?? 'Unknown Shop' }}
                        </div>
                    @endforeach

                    <!-- TOTAL -->
                    <p><strong>Total:</strong> MMK {{ number_format($order->total_amount) }}</p>

                    <!-- STATUS -->
                    <p>
                        <strong>Status:</strong>
                        <span class="badge {{ $order->delivery_status }}">
                            {{ ucfirst($order->delivery_status) }}
                        </span>
                    </p>

                    <!-- BUTTON -->
                    @if($order->delivery_status == 'assigned')
                        <form method="POST" action="{{ url('/deli/' . $order->id . '/delivered') }}">
                            @csrf
                            <button type="submit">
                                Mark Completed
                            </button>
                        </form>
                    @endif

                </div>
            @endforeach

        </div>
    @endif
</div>

</body>
</html>