<x-filament::page>
    <form wire:submit.prevent="save">
        {{ $this->schema }}

        <x-filament::button type="submit" class="save-btn mt-4">
            Save Changes
        </x-filament::button>
    </form>

    <style>
        .save-btn {
            padding: 12px 24px; /* vertical | horizontal padding */
            background-color: #2563eb; /* blue */
            color: #fff;
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .save-btn:hover {
            background-color: #1e40af; /* darker blue on hover */
        }

        /* Optional: move button slightly to the right */
        .save-btn {
            margin-top: 20px;
            margin-left: 0px; /* adjust as needed */
        }
    </style>
</x-filament::page>
