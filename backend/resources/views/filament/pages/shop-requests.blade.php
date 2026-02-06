<x-filament::page>

    @if($this->pendingShops->isEmpty())
        <p class="no-pending">There are no pending shops right now.</p>
    @else
        <div class="table-wrapper">
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Shop Name</th>
                        <th>Owner Name</th>
                        <th>Owner Email</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($this->pendingShops as $index => $shop)
                        <tr>
                            <td>{{ $index + 1 }}</td> <!-- AUTO ROW NUMBER -->
                            <td>{{ $shop->name }}</td>
                            <td>{{ $shop->owner->name }}</td>
                            <td>{{ $shop->owner->email }}</td>
                            <td>{{ ucfirst($shop->status) }}</td>
                            <td>
                                <button 
                                    wire:click="approveShop({{ $shop->id }})"
                                    class="approve-btn">
                                    Approve
                                </button>
                                <button 
                                    wire:click="denyShop({{ $shop->id }})"
                                    class="deny-btn">
                                    Deny
                                </button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <style>
        /* Table wrapper for scrolling if needed */
        .table-wrapper {
            overflow-x: auto;
        }

        /* General table styling */
        .styled-table {
            width: 100%;
            border-collapse: seperate;
            font-family: sans-serif;
            background-color: #80808000;
            padding : 5px;
            border-spacing: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .styled-table th, .styled-table td {
            padding: 12px 16px;
            border:  #808080;
            text-align: left;
            background-color: #f3f4f60c; /* light grey */
        }
        .styled-table thead tr th:first-child {
            border-top-left-radius: 16px; /* top-left corner */
        }
        .styled-table thead tr th:last-child {
            border-top-right-radius: 16px; /* top-right corner */
        }
        /* Header background */
        .styled-table thead {
            border-radius: 30px;
            background-color: #f3f4f627; /* light grey */
            color: #ffffff; /* dark text */
            font-weight: 600;
        }

        /* Buttons */
        .approve-btn {
            padding: 6px 12px;
            background-color: #16a34a;
             color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .approve-btn:hover {
            background-color: #15803d;
        }

        .deny-btn {
            padding: 6px 12px;
            background-color: #dc2626;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .deny-btn:hover {
            background-color: #b91c1c;
        }

    }
    </style>
</x-filament::page>
