<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResearchController extends Controller
{
    public function patents(Request $request)
    {
        $department = $request->query('department');

        $data = DB::table('patents')
            ->where('department', $department)
            ->paginate(20);

        // Add serial number
        $data->getCollection()->transform(function ($item, $key) use ($data) {
            $item->s_no = ($data->currentPage() - 1) * $data->perPage() + $key + 1;
            return $item;
        });

        return $data;
    }
    public function conferences(Request $request)
    {
        $department = $request->query('department');

        $data = DB::table('conferences')
            ->where('department', $department)
            ->paginate(20);

        // Add continuous serial number
        $data->getCollection()->transform(function ($item, $key) use ($data) {
            $item->s_no = ($data->currentPage() - 1) * $data->perPage() + $key + 1;
            return $item;
        });

        return $data;
    }
    public function jss_research_journals(Request $request)
    {
        $department = $request->query('department');

        $data = DB::table('jss_research_journals')
            ->where('department', $department)
            ->paginate(20);

        // Add continuous serial number
        $data->getCollection()->transform(function ($item, $key) use ($data) {
            $item->s_no = ($data->currentPage() - 1) * $data->perPage() + $key + 1;
            return $item;
        });

        return $data;
    }
    public function projects_submitted(Request $request)
    {
        $department = $request->query('department');

        $data = DB::table('projects_submitted')
            ->where('department', $department)
            ->paginate(20);

        // Add continuous serial number
        $data->getCollection()->transform(function ($item, $key) use ($data) {
            $item->s_no = ($data->currentPage() - 1) * $data->perPage() + $key + 1;
            return $item;
        });

        return $data;
    }
    public function projects_sanctioned(Request $request)
    {
        $department = $request->query('department');

        $data = DB::table('projects_sanctioned')
            ->where('department', $department)
            ->paginate(20);

        // Add continuous serial number
        $data->getCollection()->transform(function ($item, $key) use ($data) {
            $item->s_no = ($data->currentPage() - 1) * $data->perPage() + $key + 1;
            return $item;
        });

        return $data;
    }
}
