<?php

namespace App\Http\Controllers\Admin\Industry;

use App\Http\Controllers\Controller;
use App\Models\Industry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndustryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $industries = Industry::query()
            ->when($search, fn ($q) =>
            $q->where('name', 'like', "%{$search}%")
            )
            ->orderBy('id','desc')
            ->paginate($request->perPage ?? 5)
            ->withQueryString();

        return Inertia::render('admin/industry/index', [
            'industries' => $industries->items(),
            'meta' => [
                'from' => $industries->firstItem(),
                'to' => $industries->lastItem(),
                'total' => $industries->total(),
                'current_page' => $industries->currentPage(),
                'last_page' => $industries->lastPage(),
                'searchPlaceholderText' => 'Search Industry...',
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
            'name' => 'required|string|max:255|unique:industries,name'
        ]);

        Industry::create([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success','Industry created successfully.');
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
    public function destroy(Industry $industry)
    {
        $industry->delete();

        return redirect()->back()->with('success','Industry deleted successfully.');
    }
}
