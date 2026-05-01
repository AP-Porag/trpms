<?php

namespace App\Http\Requests\Candidate;

use App\Http\Requests\BaseRequest;

class CandidateRequest extends BaseRequest
{

    //    public function rules(): array
    //    {
    //        return [
    //            'first_name' => 'required|string|max:255',
    //            'last_name' => 'required|string|max:255',
    //            'email' => 'required|email',
    //            'phone' => 'required|string',
    //            'address' => 'nullable',
    //            'file'    => 'nullable|file|mimes:pdf,doc,docx|max:5120',
    //        ];
    //    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email',
            'phone'      => 'required|string',
            'address'    => 'nullable',
            'expected_salary' => 'nullable|numeric',
            'resumes.*' => 'file|max:10240',

            // 'file' => 'nullable|array',
            //            'file.*' => 'file',
        ];
    }
}
