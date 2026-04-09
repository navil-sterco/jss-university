<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\SectionTemplate;
use Illuminate\Support\Facades\File;

class SectionTemplateController extends Controller
{
    public function index()
    {
        $this->syncFromJson();

        $templates = SectionTemplate::orderBy('key')->get()->map(function ($t) {
            return [
                'id' => $t->id,
                'key' => $t->key,
                'label' => $t->label,
                'allow_multiple_items' => (bool) $t->allow_multiple_items,
                'fields' => $t->fields ?? [],
                'is_active' => (bool) $t->is_active,
            ];
        });

        return Inertia::render('SectionTemplates/Index', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:section_templates,key',
            'label' => 'required|string|max:255',
            'allow_multiple_items' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'fields' => 'nullable|array',
            'fields.*.name' => 'required_with:fields|string|max:255',
            'fields.*.label' => 'nullable|string|max:255',
            'fields.*.type' => 'nullable|string|max:50',
            'fields.*.placeholder' => 'nullable|string|max:255',
            // repeater support
            'fields.*.subfields' => 'nullable|array',
            'fields.*.subfields.*.name' => 'required_with:fields.*.subfields|string|max:255',
            'fields.*.subfields.*.label' => 'nullable|string|max:255',
            'fields.*.subfields.*.type' => 'nullable|string|max:50',
            'fields.*.subfields.*.placeholder' => 'nullable|string|max:255',
            // nested repeater support
            'fields.*.subfields.*.subfields' => 'nullable|array',
            'fields.*.subfields.*.subfields.*.name' => 'required_with:fields.*.subfields.*.subfields|string|max:255',
            'fields.*.subfields.*.subfields.*.label' => 'nullable|string|max:255',
            'fields.*.subfields.*.subfields.*.type' => 'nullable|string|max:50',
            'fields.*.subfields.*.subfields.*.placeholder' => 'nullable|string|max:255',
        ]);

        SectionTemplate::create([
            'key' => $validated['key'],
            'label' => $validated['label'],
            'allow_multiple_items' => (bool) ($validated['allow_multiple_items'] ?? true),
            'is_active' => (bool) ($validated['is_active'] ?? true),
            'fields' => $validated['fields'] ?? [],
        ]);

        return redirect()->route('section-templates.index')->with('success', 'Template created.');
    }

    public function update(Request $request, SectionTemplate $sectionTemplate)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:section_templates,key,' . $sectionTemplate->id,
            'label' => 'required|string|max:255',
            'allow_multiple_items' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'fields' => 'nullable|array',
            'fields.*.name' => 'required_with:fields|string|max:255',
            'fields.*.label' => 'nullable|string|max:255',
            'fields.*.type' => 'nullable|string|max:50',
            'fields.*.placeholder' => 'nullable|string|max:255',
            // repeater support
            'fields.*.subfields' => 'nullable|array',
            'fields.*.subfields.*.name' => 'required_with:fields.*.subfields|string|max:255',
            'fields.*.subfields.*.label' => 'nullable|string|max:255',
            'fields.*.subfields.*.type' => 'nullable|string|max:50',
            'fields.*.subfields.*.placeholder' => 'nullable|string|max:255',
            // nested repeater support
            'fields.*.subfields.*.subfields' => 'nullable|array',
            'fields.*.subfields.*.subfields.*.name' => 'required_with:fields.*.subfields.*.subfields|string|max:255',
            'fields.*.subfields.*.subfields.*.label' => 'nullable|string|max:255',
            'fields.*.subfields.*.subfields.*.type' => 'nullable|string|max:50',
            'fields.*.subfields.*.subfields.*.placeholder' => 'nullable|string|max:255',
        ]);

        $sectionTemplate->update([
            'key' => $validated['key'],
            'label' => $validated['label'],
            'allow_multiple_items' => (bool) ($validated['allow_multiple_items'] ?? true),
            'is_active' => (bool) ($validated['is_active'] ?? true),
            'fields' => $validated['fields'] ?? [],
        ]);

        return redirect()->route('section-templates.index')->with('success', 'Template updated.');
    }

    public function destroy(SectionTemplate $sectionTemplate)
    {
        $sectionTemplate->delete();
        return redirect()->route('section-templates.index')->with('success', 'Template deleted.');
    }

    /**
     * Sync templates from JSON:
     * - If table is empty, seed all.
     * - If not empty, upsert any new keys added to the JSON.
     */
    private function syncFromJson(): void
    {
        $path = resource_path('js/data/sectionTemplates.json');
        if (!File::exists($path)) {
            return;
        }

        $json = json_decode(File::get($path), true);
        if (!is_array($json)) {
            return;
        }

        $existingKeys = SectionTemplate::pluck('id', 'key')->toArray();

        foreach ($json as $key => $def) {
            $label = $def['label'] ?? $key;
            $fields = $def['fields'] ?? [];
            $allowMultiple = $def['allow_multiple_items'] ?? ($key === 'heading' ? false : true);

            if (isset($existingKeys[$key])) {
                continue;
            }

            SectionTemplate::create([
                'key' => $key,
                'label' => $label,
                'fields' => $fields,
                'allow_multiple_items' => $allowMultiple,
                'is_active' => true,
            ]);
        }
    }
}

