<?php

use App\Http\Controllers\Admin\Activity\ActivityLogController;
use App\Http\Controllers\Admin\Candidate\CandidateController;
use App\Http\Controllers\Admin\Client\ClientController;
use App\Http\Controllers\Admin\Engagement\EngagementController;
use App\Http\Controllers\Admin\Job\JobController;
use App\Http\Controllers\Admin\JobCandidate\JobCandidateController;
use App\Http\Controllers\Admin\Note\CandidateNoteController;
use App\Http\Controllers\Admin\Note\ClientNoteController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\EditorController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::get('/execute-command', function () {
//    return redirect()->route('login');
//    Artisan::call('storage:link');
    Artisan::call('migrate:fresh --seed');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Artisan::call('route:clear');
    Artisan::call('optimize');
    dd('All commands executed successfully');
});
Route::get('/', function () {
    return redirect()->route('login');
//    return Inertia::render('welcome');
})->name('home');
//->prefix('admin')->as('admin.')
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/under-development', function (\Illuminate\Http\Request $request) {
        return Inertia::render('UnderDevelopment', [
            'module' => $request->get('module'),
        ]);
    })->name('under-development');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class);

    Route::resource('clients', ClientController::class);

    Route::resource('jobs', EngagementController::class);

    Route::post('clients/{client}/notes', [ClientNoteController::class, 'store'])
        ->name('clients.notes.store');

    Route::delete('notes/{note}', [ClientNoteController::class, 'destroy'])
        ->name('notes.destroy');

    Route::post('/editor/image-upload', [EditorController::class, 'upload'])
        ->name('editor.image.upload');

    Route::post('/editor/finalize', [EditorController::class, 'finalize'])
        ->name('editor.finalize');

    Route::resource('candidates', CandidateController::class);
    Route::get(
        '/candidates/search/for/job',
        [CandidateController::class, 'search']
    )->name('candidates.search');

    Route::post('clients/{client}/notes', [CandidateNoteController::class, 'store'])
        ->name('clients.notes.store');

    Route::post(
        '/job-candidates/{jobCandidate}/change-stage',
        [JobCandidateController::class, 'changeStage']
    )->name('job-candidates.change-stage');

    Route::post(
        '/job-candidates',
        [JobCandidateController::class, 'store']
    )->name('job-candidates.store');

    Route::delete(
        '/job-candidates/{jobCandidate}',
        [JobCandidateController::class, 'destroy']
    )->name('job-candidates.destroy');

    //Activity Log
    Route::get(
        '/activity-logs/for/subject',
        [ActivityLogController::class, 'forSubject']
    )->name('activity.logs.for-subject');

    //making some change
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
