<?php

namespace App\Http\Controllers\Admin\Event;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // ================= FILTERS =================
        $filters = [
            'view' => $request->get('view', 'month'), // month | week | day | agenda
            'date' => $request->get('date', now()->toDateString()),
        ];

        // ================= DATE RANGE =================
        $date = \Carbon\Carbon::parse($filters['date']);

        switch ($filters['view']) {
            case 'day':
                $start = $date->copy()->startOfDay();
                $end = $date->copy()->endOfDay();
                break;

            case 'week':
                $start = $date->copy()->startOfWeek();
                $end = $date->copy()->endOfWeek();
                break;

            case 'agenda':
                $start = $date->copy()->startOfDay();
                $end = $date->copy()->addDays(30)->endOfDay();
                break;

            case 'month':
            default:
                $start = $date->copy()->startOfMonth();
                $end = $date->copy()->endOfMonth();
                break;
        }

        // ================= EVENTS =================
        $events = \App\Models\Event::query()
            ->whereBetween('start_at', [$start, $end])
            ->select([
                'id',
                'type',
                'entity_type',
                'entity_id',
                'title',
                'description',
                'start_at',
                'color',
                'status',
            ])
            ->orderBy('start_at')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'start' => $event->start_at,
                    'color' => $event->color,
                    'type' => $event->type,
                    'status' => $event->status,
                    'entity_type' => $event->entity_type,
                    'entity_id' => $event->entity_id,
                    'description' => $event->description,
                ];
            });

        // ================= RESPONSE =================
        return \Inertia\Inertia::render('admin/events/index', [
            'filters' => $filters,
            'range' => [
                'start' => $start->toDateTimeString(),
                'end' => $end->toDateTimeString(),
            ],
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
