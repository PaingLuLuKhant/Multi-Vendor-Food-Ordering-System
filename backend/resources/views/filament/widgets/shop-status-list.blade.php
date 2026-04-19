<x-filament::widget>
    <x-filament::card>
        <div class="space-y-4">
            <h2 class="text-lg font-bold tracking-tight">
                Shop Status Details
            </h2>
            
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- Active Shops -->
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <div class="h-3 w-3 rounded-full bg-green-500"></div>
                        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                            ✅ Active Shops (Has Products)
                        </h3>
                        <span class="ml-auto inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            {{ $activeShops->count() }}
                        </span>
                    </div>
                    
                    <div class="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                        @forelse($activeShops as $shop)
                            <div class="flex items-center justify-between p-3">
                                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {{ $shop->name }}
                                </span>
                                <span class="text-xs text-gray-500">
                                    {{ $shop->products->count() }} products
                                </span>
                            </div>
                        @empty
                            <div class="p-4 text-center text-sm text-gray-500">
                                No active shops found
                            </div>
                        @endforelse
                    </div>
                </div>
                
                <!-- Inactive Shops -->
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <div class="h-3 w-3 rounded-full bg-red-500"></div>
                        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                            ❌ Inactive Shops (No Products)
                        </h3>
                        <span class="ml-auto inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-700">
                            {{ $inactiveShops->count() }}
                        </span>
                    </div>
                    
                    <div class="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                        @forelse($inactiveShops as $shop)
                            <div class="p-3">
                                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {{ $shop->name }}
                                </span>
                            </div>
                        @empty
                            <div class="p-4 text-center text-sm text-gray-500">
                                No inactive shops found
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </x-filament::card>
</x-filament::widget>