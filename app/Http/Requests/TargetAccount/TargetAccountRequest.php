<?php

namespace App\Http\Requests\TargetAccount;

use App\Http\Requests\BaseRequest;

class TargetAccountRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'      => ['required', 'string', 'min:3'],

            'company_name'      => ['required', 'string', 'min:3'],

            'rating'            => ['nullable', 'string'],

            'industry_id'       => ['nullable', 'string'],

            'status'            => ['required', 'string'],

            'departments'       => ['nullable', 'array'],
            'departments.*'     => ['string'],

            'is_use_agency'     => ['nullable', 'boolean'],

            'current_openings'  => ['nullable', 'string'],

            'revenue_potential' => ['required', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' => 'Company name is required.',
            'company_name.min'      => 'Company name must be at least 3 characters.',
        ];
    }
}
