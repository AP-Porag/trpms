<?php

namespace App\Providers;

use App\Models\Invoice;
use App\Models\JobCandidate;
use App\Models\Notification;
use App\Observers\JobCandidateObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\Placement;
use App\Models\Candidate;
use App\Models\Client;
use App\Models\Contact;
use App\Models\Engagement;
use Inertia\Inertia;

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
            'placement' => Placement::class, //done
            'candidate' => Candidate::class, //done
            'client' => Client::class, //done
            'engagement' => Engagement::class, //done
            'invoice' => Invoice::class,
            'contact' => Contact::class,
            'prospect' => Client::class,
        ]);

        Inertia::share([
            'notifications' => function () {
                return Notification::query()
                    ->where(function ($q) {
                        $q->where('status', 0)
                            ->orWhereMonth('created_at', now()->month);
                    })
                    ->latest()
                    ->limit(50)
                    ->get();
            },

            'notification_unseen_count' => function () {
                return Notification::where('status', 0)->count();
            },
        ]);

        JobCandidate::observe(JobCandidateObserver::class);
    }
}
