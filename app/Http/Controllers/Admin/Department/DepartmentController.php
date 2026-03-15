<?php

namespace App\Http\Controllers\Admin\Department;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $department = Department::query()
            ->when($search, fn ($q) =>
            $q->where('name', 'like', "%{$search}%")
            )
            ->orderBy('id','desc')
            ->paginate($request->perPage ?? 5)
            ->withQueryString();

        return Inertia::render('admin/department/index', [
            'departments' => $department->items(),
            'meta' => [
                'from' => $department->firstItem(),
                'to' => $department->lastItem(),
                'total' => $department->total(),
                'current_page' => $department->currentPage(),
                'last_page' => $department->lastPage(),
                'searchPlaceholderText' => 'Search Department...',
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
            'name' => 'required|string|max:255|unique:departments,name'
        ]);

        Department::create([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success','Department created successfully.');
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
    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->back()->with('success','Department deleted successfully.');
    }
}
