use Filament\Facades\Filament;
namespace App\Providers\Filament;

public function boot(): void
{
    Filament::registerWidgets([
        \App\Filament\Widgets\UserChart::class,
        \App\Filament\Widgets\SalesStats::class, // if you also want your stats widget
    ]);
}
