<?php

namespace App\Services\Activity;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;

class ActivityLogger
{
    public static function log(
        Model $subject,
        string $event,
        array $metadata = [],
        ?int $actorId = null
    ): ActivityLog {
        return ActivityLog::create([
            'actor_id'    => $actorId ?? auth()->id(),
            'subject_type'=> get_class($subject),
            'subject_id'  => $subject->getKey(),
            'event'       => $event,
            'metadata'    => $metadata,
        ]);
    }
}

