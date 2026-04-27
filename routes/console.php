<?php

use App\Jobs\EventSyncJob;
use App\Jobs\NotificationSyncJob;
use App\Jobs\SyncEngagementStageJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

//Artisan::command('inspire', function () {
//    $this->comment(Inspiring::quote());
//})->purpose('Display an inspiring quote');

Schedule::job(new EventSyncJob)->everyMinute();
Schedule::job(new NotificationSyncJob)->everyMinute();
Schedule::job(new SyncEngagementStageJob)->hourly();


//command to run the job
//php artisan queue:work
//php artisan schedule:work
