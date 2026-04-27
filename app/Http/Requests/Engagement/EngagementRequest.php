<?php

namespace App\Http\Requests\Engagement;

use App\Http\Requests\BaseRequest;

class EngagementRequest extends BaseRequest
{
    public function rules()
    {
        return [
            'client_id' => 'required',
            'title' => 'required',
            'description_id' => 'required',
            'fee_type' => 'required',
            'fee_value' => 'required',
            'department' => 'required',
            'location' => 'required',
            'priority' => 'required',
        ];
    }
}
