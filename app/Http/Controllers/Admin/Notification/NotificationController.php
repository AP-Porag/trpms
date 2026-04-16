<?php

namespace App\Http\Controllers\Admin\Notification;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Utils\GlobalConstant;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::query()
            ->where(function ($q) {
                $q->where('status', GlobalConstant::NOTIFICATION_STATUS_UNSEEN) // unseen
                ->orWhereMonth('created_at', now()->month);
            })
            ->latest()
            ->limit(50)
            ->get();

        $unseenCount = Notification::where('status', GlobalConstant::NOTIFICATION_STATUS_UNSEEN)->count();

        return response()->json([
            'notifications' => $notifications,
            'unseen_count' => $unseenCount,
        ]);
    }

    public function toggle($id)
    {
        $notification = Notification::findOrFail($id);

        $notification->status = !$notification->status;
        $notification->save();

        return back();

//        return response()->json([
//            'success' => true,
//            'status' => $notification->status,
//        ]);
    }
}
