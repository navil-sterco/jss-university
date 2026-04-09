<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Popup;

class PopupController extends Controller
{
    public function index()
    {
        $popup = Popup::first();

        $popupData = $popup ? [
            'id' => $popup->id,
            'heading' => $popup->heading ?? '',

            // ✅ Transform items here
            'items' => collect($popup->items)->map(function ($item) {
                return [
                    'title' => $item['title'] ?? '',
                    'link' => $item['link'] ?? '',
                    'image' => !empty($item['image']) 
                        ? asset($item['image'])  // ✅ full URL
                        : null,
                ];
            }),

            'status' => (bool)$popup->status,
        ] : [
            'id' => null,
            'heading' => '',
            'items' => [],
            'status' => true,
        ];

        return response()->json([
            'success' => true,
            'popup' => $popupData,
            'message' => 'Popup fetched successfully',
        ]);
    }
}
