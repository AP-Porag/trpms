<?php

namespace App\Http\Controllers\Admin\GlobalSearch;

use App\Http\Controllers\BaseController;
use App\Services\GlobalSearch\GlobalSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GlobalSearchController extends BaseController
{
    public function __construct(
        protected GlobalSearchService $service
    ) {}

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => [
                'required',
                'string',
                'min:3',
            ],

            'type' => [
                'nullable',
                'string',
                Rule::in(GlobalSearchService::TYPES),
            ],
        ]);

        $query = trim($validated['q']);

        $type = $validated['type'] ?? 'all';

        return response()->json(
            $this->service->search(
                query: $query,
                type: $type
            )
        );
    }
}
