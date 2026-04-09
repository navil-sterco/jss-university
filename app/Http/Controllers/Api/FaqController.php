<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Faq;

class FaqController extends Controller
{
    public function admission_faq()
    {
        $page_id = 108;

        try {
            $faqs = Faq::with('pages')->where('status', 1)
                ->whereHas('pages', function ($q) use ($page_id) {
                    $q->where('pages.id', $page_id);
                })
                ->get();

            return response()->json([
                'status' => true,
                'data' => $faqs,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch data',
            ], 500);
        }
    }
}
