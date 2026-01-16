<?php

namespace App\Http\Requests\Client;

use App\Http\Requests\BaseRequest;

class ClientRequest extends BaseRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'nullable',
            'client_type' => 'required',
            'fee_percentage' => 'required',
            'status' => 'required',
        ];
    }
}
