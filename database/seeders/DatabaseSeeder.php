<?php

namespace Database\Seeders;

use App\Models\Agreement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Client;
use App\Models\Engagement;
use App\Models\Candidate;
use App\Models\JobCandidate;
use App\Models\ActivityLog;
use App\Services\Activity\ActivityEvent;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | USERS
        |--------------------------------------------------------------------------
        */
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name'  => 'Last',
            'email'      => 'admin@app.com',
            'password'   => Hash::make('12345678'),
            'user_type'  => 'admin',
            'status'     => true,
        ]);

        User::create([
            'first_name' => 'User',
            'last_name'  => 'Last',
            'email'      => 'user@app.com',
            'password'   => Hash::make('12345678'),
            'user_type'  => 'user',
            'status'     => true,
        ]);

        $actors = User::factory(8)->create();
        $actor  = $actors->first() ?? $admin;

        /*
        |--------------------------------------------------------------------------
        | CANDIDATES
        |--------------------------------------------------------------------------
        */
        $candidates = Candidate::factory(50)->create();

        /*
        |--------------------------------------------------------------------------
        | CLIENTS → JOBS → PIPELINE SNAPSHOTS
        |--------------------------------------------------------------------------
        */
        Client::factory(8)->create()->each(function ($client) use ($candidates, $actor) {

            /*
    |--------------------------------------------------------------------------
    | AGREEMENTS (1–2 PER CLIENT)
    |--------------------------------------------------------------------------
    */
            Agreement::factory(rand(1, 2))->create([
                'client_id' => $client->id,
            ]);
            $jobs = Engagement::factory(rand(2, 4))
                ->create(['client_id' => $client->id]);

            foreach ($jobs as $job) {

                // -----------------------------
                // JOB CREATED ACTIVITY
                // -----------------------------
                ActivityLog::create([
                    'actor_id'     => $actor->id,
                    'subject_type' => Engagement::class,
                    'subject_id'   => $job->id,
                    'event'        => ActivityEvent::JOB_CREATED,
                    'metadata'     => [
                        'job_title' => $job->title,
                        'client_id' => $client->id,
                    ],
                    'created_at'   => now()->subDays(rand(10, 30)),
                ]);

                foreach ($candidates->random(rand(10, 18)) as $candidate) {

                    /*
                    |--------------------------------------------------------------------------
                    | CREATE JOB CANDIDATE (BASE STATE)
                    |--------------------------------------------------------------------------
                    */
                    $submittedAt = now()->subDays(rand(20, 40));

                    $jobCandidate = JobCandidate::create([
                        'job_id'        => $job->id,
                        'candidate_id'  => $candidate->id,
                        'stage'         => 'submitted',
                        'submitted_at'  => $submittedAt,
                    ]);

                    ActivityLog::create([
                        'actor_id'     => $actor->id,
                        'subject_type' => JobCandidate::class,
                        'subject_id'   => $jobCandidate->id,
                        'event'        => ActivityEvent::CANDIDATE_ADDED_TO_JOB,
                        'metadata'     => [
                            'job_id' => $job->id,
                            'candidate_id' => $candidate->id,
                            'candidate_name' => $candidate->first_name.' '.$candidate->last_name,
                            'stage' => 'submitted',
                        ],
                        'created_at'   => $submittedAt,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | FINAL PIPELINE SNAPSHOT (NO SERVICES)
                    |--------------------------------------------------------------------------
                    */
                    $finalStage = collect([
                        'submitted',
                        'interviewing',
                        'offered',
                        'placed',
                        'rejected',
                    ])->random();

                    $timestamps = match ($finalStage) {
                        'interviewing' => [
                            'interviewing_at' => $submittedAt->copy()->addDays(5),
                        ],
                        'offered' => [
                            'interviewing_at' => $submittedAt->copy()->addDays(5),
                            'offered_at'      => $submittedAt->copy()->addDays(10),
                        ],
                        'placed' => [
                            'interviewing_at' => $submittedAt->copy()->addDays(5),
                            'offered_at'      => $submittedAt->copy()->addDays(10),
                            'placed_at'       => $submittedAt->copy()->addDays(15),
                        ],
                        'rejected' => [
                            'rejected_at'     => $submittedAt->copy()->addDays(7),
                        ],
                        default => [],
                    };

                    $jobCandidate->updateQuietly(array_merge([
                        'stage' => $finalStage,
                    ], $timestamps));

                    /*
                    |--------------------------------------------------------------------------
                    | ACTIVITY SNAPSHOTS
                    |--------------------------------------------------------------------------
                    */
                    ActivityLog::create([
                        'actor_id'     => $actor->id,
                        'subject_type' => JobCandidate::class,
                        'subject_id'   => $jobCandidate->id,
                        'event'        => ActivityEvent::STAGE_CHANGED,
                        'metadata'     => [
                            'from' => 'submitted',
                            'to'   => $finalStage,
                        ],
                        'created_at'   => now()->subDays(rand(3, 8)),
                    ]);

                    if ($finalStage === 'placed') {
                        ActivityLog::create([
                            'actor_id'     => $actor->id,
                            'subject_type' => JobCandidate::class,
                            'subject_id'   => $jobCandidate->id,
                            'event'        => ActivityEvent::CANDIDATE_PLACED,
                            'created_at'   => now()->subDays(2),
                        ]);
                    }

                    if ($finalStage === 'rejected') {
                        ActivityLog::create([
                            'actor_id'     => $actor->id,
                            'subject_type' => JobCandidate::class,
                            'subject_id'   => $jobCandidate->id,
                            'event'        => ActivityEvent::CANDIDATE_REJECTED,
                            'created_at'   => now()->subDays(4),
                        ]);
                    }
                }
            }
        });
    }
}
