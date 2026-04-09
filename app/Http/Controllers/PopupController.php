<?php

namespace App\Http\Controllers;

use App\Models\Popup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class PopupController extends Controller
{
    public function edit()
    {
        $popup = Popup::first();
        $popupData = $popup ? [
            'id' => $popup->id,
            'heading' => $popup->heading ?? '',
            'items' => is_array($popup->items) ? $popup->items : [],
            'status' => (bool)$popup->status,
        ] : [
            'id' => null,
            'heading' => '',
            'items' => [],
            'status' => true,
        ];

        return Inertia::render('Popups/Edit', [
            'popup' => $popupData,
        ]);
    }

    public function update(Request $request)
    {
        $popup = Popup::first();

        $validated = $request->validate([
            'heading' => 'nullable|string|max:255',
            'status' => 'nullable|boolean',
            'items' => 'nullable|array',
            'items.*.title' => 'nullable|string|max:255',
            'items.*.link' => 'nullable|string|max:500',
            'items.*.image' => 'nullable', 
        ]);

        $items = $request->input('items', []);
        $finalItems = [];

        if (is_array($items)) {
            foreach ($items as $index => $item) {
                $itemData = [
                    'title' => $item['title'] ?? '',
                    'link' => $item['link'] ?? '',
                    'image' => $item['image'] ?? null,
                ];

                // Check for new file upload: item[0][image]
                if ($request->hasFile("items.{$index}.image")) {
                    // Delete old image if it was a string path
                    if (!empty($itemData['image']) && is_string($itemData['image'])) {
                        if (File::exists(public_path($itemData['image']))) {
                            File::delete(public_path($itemData['image']));
                        }
                    }

                    $file = $request->file("items.{$index}.image");
                    $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $folderPath = 'assets/img/popups/';
                    
                    if (!File::exists(public_path($folderPath))) {
                        File::makeDirectory(public_path($folderPath), 0755, true);
                    }
                    
                    $file->move(public_path($folderPath), $fileName);
                    $itemData['image'] = $folderPath . $fileName;
                }

                $finalItems[] = $itemData;
            }
        }


        $updateData = [
            'heading' => $validated['heading'],
            'status' => $request->boolean('status'),
            'items' => $finalItems,
        ];

        if ($popup) {
            $popup->update($updateData);
        } else {
            Popup::create($updateData);
        }

        return redirect()->route('popup.edit')->with('success', 'Popup updated successfully!');
    }
}
