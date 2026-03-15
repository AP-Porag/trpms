<?php

namespace App\Http\Controllers\Admin\Source;

use App\Http\Controllers\Controller;
use App\Models\Source;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $sources = Source::query()
            ->when($search, fn ($q) =>
            $q->where('name', 'like', "%{$search}%")
            )
            ->orderBy('id','desc')
            ->paginate($request->perPage ?? 5)
            ->withQueryString();

        return Inertia::render('admin/source/index', [
            'sources' => $sources->items(),
            'meta' => [
                'from' => $sources->firstItem(),
                'to' => $sources->lastItem(),
                'total' => $sources->total(),
                'current_page' => $sources->currentPage(),
                'last_page' => $sources->lastPage(),
                'searchPlaceholderText' => 'Search Source...',
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
            'name' => 'required|string|max:255|unique:sources,name'
        ]);

        Source::create([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success','Source created successfully.');
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
    public function destroy(Source $source)
    {
        $source->delete();

        return redirect()->back()->with('success','Source deleted successfully.');
    }
}
