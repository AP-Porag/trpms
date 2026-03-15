<?php

namespace App\Http\Controllers\Admin\Position;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $positions = Position::query()
            ->when($search, fn ($q) =>
            $q->where('name', 'like', "%{$search}%")
            )
            ->orderBy('id','desc')
            ->paginate($request->perPage ?? 5)
            ->withQueryString();

        return Inertia::render('admin/position/index', [
            'positions' => $positions->items(),
            'meta' => [
                'from' => $positions->firstItem(),
                'to' => $positions->lastItem(),
                'total' => $positions->total(),
                'current_page' => $positions->currentPage(),
                'last_page' => $positions->lastPage(),
                'searchPlaceholderText' => 'Search position...',
            ],
            'filters' => $request->only(['search','perPage']),
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
        $request->validate([
            'name' => 'required|string|max:255|unique:positions,name'
        ]);

        Position::create([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success','Position created successfully.');
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
    public function destroy(Position $position)
    {
        $position->delete();

        return redirect()->back()->with('success','Position deleted successfully.');
    }
}
