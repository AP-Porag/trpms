<?php

namespace App\Jobs;

use App\Services\Event\EventService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class EventSyncJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(EventService $eventService): void
    {
        $eventService->syncEvents();
    }
}
