<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EditorController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:2048'],
        ]);

        $path = $request->file('image')->store('editor-images', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ]);
    }

    public function finalize(Request $request)
    {
        $html = $request->input('content');
        $images = $request->file('images', []);

        libxml_use_internal_errors(true);
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $dom->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $imgTags = $dom->getElementsByTagName('img');
        $i = 0;

        foreach ($imgTags as $img) {
            $src = $img->getAttribute('src');

            // ONLY replace blob images
            if (str_starts_with($src, 'blob:') && isset($images[$i])) {
                $path = $images[$i]->store('jobs', 'public');

                $img->setAttribute(
                    'src',
                    asset('storage/' . $path)
                );

                $img->removeAttribute('data-temp');
                $i++;
            }
        }

        return response()->json([
            'html' => $dom->saveHTML(),
        ]);
    }


}
