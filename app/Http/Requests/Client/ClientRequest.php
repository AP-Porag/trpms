<?php

namespace App\Http\Requests\Client;

use App\Http\Requests\BaseRequest;
use App\Utils\GlobalConstant;

class ClientRequest extends BaseRequest
{
    public function rules()
    {
        // Detect which module is calling the request
        $isProspect = $this->routeIs('prospects.*');
        $isTarget   = $this->routeIs('target-accounts.*'); // future module

        // Only real clients require fee structure
        $requiresClientData = !($isProspect || $isTarget);

        return [

            'name' => 'required|string|max:255',

            'company_name' => 'required|string|max:255',

            'email' => 'required|email|max:255',

            'phone' => 'required|string|max:50',

            'address' => 'nullable|string|max:500',

            'category' => 'nullable|string',
            'rating' => 'nullable',
            'industry_id' => 'nullable|exists:industries,id',
            'departments' => 'nullable',

            /*
            |--------------------------------------------------------------------------
            | Client Type
            |--------------------------------------------------------------------------
            */

            'client_type' => $requiresClientData
                ? 'required|in:' . GlobalConstant::CLIENT_TYPE_RETAINER . ',' . GlobalConstant::CLIENT_TYPE_CONTINGENCY
                : 'nullable|in:' . GlobalConstant::CLIENT_TYPE_RETAINER . ',' . GlobalConstant::CLIENT_TYPE_CONTINGENCY,

            /*
            |--------------------------------------------------------------------------
            | Fee Value
            |--------------------------------------------------------------------------
            */

            'fee_value' => $requiresClientData
                ? 'required|numeric|min:0'
                : 'nullable|numeric|min:0',

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'status' => 'required|in:' . GlobalConstant::STATUS_ACTIVE . ',' . GlobalConstant::STATUS_INACTIVE,

            /*
            |--------------------------------------------------------------------------
            | Agreements
            |--------------------------------------------------------------------------
            */

            'agreement_type' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:255',

            'signed_date' => 'nullable|date',

            'agreements.*' => 'file|max:10240',

        ];
    }
}
