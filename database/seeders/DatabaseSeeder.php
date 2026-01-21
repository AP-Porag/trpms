<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\Client;
use App\Models\Engagement;
use App\Models\JobCandidate;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Services\Activity\ActivityEvent;
use App\Services\Activity\ActivityLogger;
use App\Services\JobCandidate\JobCandidateStageService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // -----------------------------
        // CORE USERS
        // -----------------------------
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

        // Additional actors
        $users = User::factory(8)->create();
        $actor = $users->first() ?? $admin;

        // -----------------------------
        // CANDIDATES
        // -----------------------------
        $candidates = Candidate::factory(50)->create();

        // -----------------------------
        // SERVICES
        // -----------------------------
        $stageService = app(JobCandidateStageService::class);

        // Canonical stage order
        $stageFlow = [
            'submitted',
            'interviewing',
            'offered',
            'placed',
        ];

        // -----------------------------
        // CLIENTS → JOBS → PIPELINE
        // -----------------------------
        Client::factory(8)->create()->each(function ($client) use (
            $candidates,
            $stageService,
            $actor,
            $stageFlow
        ) {

            $jobs = Engagement::factory(rand(2, 4))
                ->create(['client_id' => $client->id]);

            foreach ($jobs as $job) {

                // Job created activity
                ActivityLogger::log(
                    subject: $job,
                    event: ActivityEvent::JOB_CREATED,
                    metadata: [
                        'job_title' => $job->title,
                        'client_id' => $client->id,
                    ],
                    actorId: $actor->id
                );

                foreach ($candidates->random(rand(10, 18)) as $candidate) {

                    // -----------------------------
                    // ADD CANDIDATE TO JOB
                    // -----------------------------
                    $jobCandidate = JobCandidate::create([
                        'job_id'        => $job->id,
                        'candidate_id'  => $candidate->id,
                        'stage'         => 'submitted',
                        'submitted_at'  => now()->subDays(rand(5, 20)),
                    ]);

                    ActivityLogger::log(
                        subject: $jobCandidate,
                        event: ActivityEvent::CANDIDATE_ADDED_TO_JOB,
                        metadata: [
                            'job_id' => $job->id,
                            'candidate_id' => $candidate->id,
                            'candidate_name' => $candidate->first_name.' '.$candidate->last_name,
                            'candidate_email'=> $candidate->email,
                            'stage' => 'submitted',
                        ],
                        actorId: $actor->id
                    );

                    // -----------------------------
                    // DECIDE FINAL OUTCOME
                    // -----------------------------
                    $finalStage = collect([
                        'submitted',
                        'interviewing',
                        'offered',
                        'placed',
                        'rejected',
                    ])->random();

                    // -----------------------------
                    // WALK STAGES SEQUENTIALLY
                    // -----------------------------
                    foreach ($stageFlow as $stage) {

                        if ($stage === 'submitted') {
                            continue;
                        }

                        // Randomly stop early
                        if ($finalStage === 'rejected' && rand(0, 1)) {
                            $stageService->move($jobCandidate, 'rejected');
                            break;
                        }

                        if (
                            $finalStage !== 'rejected'
                            && array_search($stage, $stageFlow, true)
                            <= array_search($finalStage, $stageFlow, true)
                        ) {
                            $stageService->move(
                                $jobCandidate,
                                $stage,
                                $stage === 'interviewing'
                                    ? now()->addDays(rand(1, 3))
                                    : null
                            );
                        }
                    }
                }
            }
        });
    }

}
