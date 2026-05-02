<?php

use App\Jobs\EventSyncJob;
use App\Jobs\NotificationSyncJob;
use App\Jobs\SyncEngagementStageJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

//Artisan::command('inspire', function () {
//    $this->comment(Inspiring::quote());
//})->purpose('Display an inspiring quote');

//for testing
Schedule::job(new EventSyncJob)->everyMinute();
Schedule::job(new NotificationSyncJob)->everyMinute();
Schedule::job(new SyncEngagementStageJob)->everyMinute();


//for production
// Timeline events (safe to run frequently)
//Schedule::job(new EventSyncJob)->everyTenMinutes();

// Notifications (no need every minute)
//Schedule::job(new NotificationSyncJob)->everyTenMinutes();

// Engagement stage (can be frequent but lightweight)
//Schedule::job(new SyncEngagementStageJob)->everyFiveMinutes();


//command to run the job
//php artisan queue:work
//php artisan schedule:work
///usr/bin/php /home/u241149697/domains/madbrain.dev/public_html/dcms/artisan schedule:run >> /dev/null 2>&1
