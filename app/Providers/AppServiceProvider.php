<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\Placement;
use App\Models\Candidate;
use App\Models\Client;
use App\Models\Engagement;
//use App\Models\Invoice;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            'placement' => Placement::class,
            'candidate' => Candidate::class,
            'client' => Client::class,
            'job' => Engagement::class,
//            'invoice' => Invoice::class,
        ]);
    }
}
