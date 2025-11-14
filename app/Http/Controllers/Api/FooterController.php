<?php

namespace App\Http\Controllers\Api;

use App\Models\Footer;
use App\Models\ContactInfo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class FooterController extends Controller
{
    public function index(): JsonResponse
    {
        $contactInfo = ContactInfo::first();
        $footer = Footer::first();
        
        if (!$contactInfo || !$footer) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $transformedData = [
            'address' => $contactInfo->address ?? "C-20/1, Sector - 62, Noida, Uttar Pradesh",
            'phone' => $this->formatPhone($contactInfo->phone),
            'email' => $contactInfo->email ?? "admission@jssaten.ac.in",
            'landlines' => [
                $contactInfo->landline_direct ? $contactInfo->landline_direct . " (Direct)" : "0120-2401448 (Direct)",
                $contactInfo->landline_epbx ? $contactInfo->landline_epbx . " (EPBX)" : "0120-2400115, 2401442, 2401449 (EPBX)"
            ],
            'copyright' => $contactInfo->copyright,
            'sections' => $this->transformNavigationItems($footer->navigation_items),
            'quickLinks' => $this->transformQuickLinks($footer->quick_links),
            'socials' => $this->transformSocials($contactInfo)
        ];

        return response()->json($transformedData);
    }

    /**
     * Format phone number with country code
     */
    private function formatPhone($phone): string
    {
        if (!$phone) return "+91 9311830458";
        
        // If phone doesn't start with +91, add it
        if (!str_starts_with($phone, '+91') && !str_starts_with($phone, '91')) {
            return "+91 " . substr($phone, 0, 5) . " " . substr($phone, 5);
        }
        
        return $phone;
    }

    /**
     * Transform navigation_items to sections with title and url
     */
    private function transformNavigationItems($navigationItems): array
    {
        if (empty($navigationItems)) {
            return $this->getDefaultSections();
        }

        $transformed = [];
        foreach ($navigationItems as $item) {
            $transformed[] = [
                'title' => $item['name'] ?? 'Untitled',
                'url' => $this->generateUrlFromType($item['type'] ?? '', $item['item_id'] ?? '')
            ];
        }

        return $transformed;
    }

    /**
     * Generate URL based on type and item_id
     */
    private function generateUrlFromType($type, $itemId): string
    {
        if (empty($type) || empty($itemId)) {
            return '#';
        }

        return match($type) {
            'department' => "/departments/{$itemId}",
            'page' => "/pages/{$itemId}",
            'program' => "/programs/{$itemId}",
            'faculty' => "/faculty/{$itemId}",
            default => "#"
        };
    }

    /**
     * Default sections if no navigation items
     */
    private function getDefaultSections(): array
    {
        return [
            ['title' => 'ABOUT JSS UNIVERSITY', 'url' => '/about'],
            ['title' => 'ACADEMICS', 'url' => '/academics'],
            ['title' => 'ADMISSIONS', 'url' => '/admissions'],
            ['title' => 'FACILITIES', 'url' => '/facilities'],
            ['title' => 'STUDENT SUPPORT', 'url' => '/student-support'],
            ['title' => 'RESEARCH & INNOVATION', 'url' => '/research'],
            ['title' => 'PLACEMENTS', 'url' => '/placements'],
        ];
    }

    /**
     * Transform quick_links from footer to desired format
     */
    private function transformQuickLinks($quickLinks): array
    {
        if (empty($quickLinks)) {
            return $this->getDefaultQuickLinks();
        }

        $transformed = [];
        foreach ($quickLinks as $link) {
            $transformed[] = [
                'label' => $link['text'] ?? 'Link',
                'url' => $link['link'] ?? '#'
            ];
        }

        return $transformed;
    }

    /**
     * Default quick links if none in database
     */
    private function getDefaultQuickLinks(): array
    {
        return [
            ['label' => 'Examination', 'url' => '#'],
            ['label' => 'Alumni', 'url' => '#'],
            ['label' => 'Annual Reports', 'url' => '#'],
            ['label' => 'ERP Login', 'url' => '#'],
            ['label' => 'Testimonials', 'url' => '#'],
            ['label' => 'Happenings', 'url' => '#'],
            ['label' => 'IQAC', 'url' => '#'],
            ['label' => 'Downloads', 'url' => '#'],
            ['label' => 'Careers', 'url' => '#'],
            ['label' => 'OBC Cell', 'url' => '#'],
            ['label' => 'National Digital Library', 'url' => '#'],
            ['label' => 'Online Grievance System', 'url' => '#'],
        ];
    }

    /**
     * Transform social media links from contact info
     */
    private function transformSocials($contactInfo): array
    {
        return [
            ['icon' => 'facebook', 'url' => $contactInfo->facebook ?? '#'],
            ['icon' => 'twitter', 'url' => $contactInfo->x ?? '#'],
            ['icon' => 'youtube', 'url' => $contactInfo->youtube ?? '#'],
            ['icon' => 'linkedin', 'url' => $contactInfo->linkedin ?? '#'],
            ['icon' => 'instagram', 'url' => $contactInfo->instagram ?? '#'],
        ];
    }
}
