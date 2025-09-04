<?php

namespace App\Http\Controllers;

// Import react
use Inertia\Inertia;

use App\Models\Post;
use Inertia\Response;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Method untuk memanggil halaman dashboard tabel post (index)
    public function index(): Response
    {
        return Inertia::render('posts',[
            'posts' => Post::all(),
        ]);
    }

    // Method untuk kirim data ke database
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $picturePath = null;

        // Handle file upload
        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('posts', 'public');
        }

        // Simpan data ke database
        Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'picture' => $picturePath,
            'status' => $request->status ?? 'draft', // Default ke draft jika tidak ada status
        ]);

        return redirect('/posts')->with('success', 'Post created.');
    }

    // Method untuk ubah data
    public function update(Request $request, Post $post)
    {
        // Validasi input
        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $picturePath = $post->picture; // Keep existing picture by default

        // Handle file upload
        if ($request->hasFile('picture')) {
            // Delete old picture if exists
            if ($post->picture) {
                $oldPicturePath = storage_path('app/public/' . $post->picture);
                if (file_exists($oldPicturePath)) {
                    unlink($oldPicturePath);
                }
            }

            // Store new picture
            $picturePath = $request->file('picture')->store('posts', 'public');
        }

        // Update data di database
        $post->update([
            'title' => $request->title,
            'content' => $request->content,
            'picture' => $picturePath,
            'status' => $request->status ?? $post->status, // Gunakan status existing jika tidak ada input baru
        ]);

        return redirect('/posts')->with('success', 'Post updated successfully.');
    }

    // Method untuk hapus data
    public function destroy(Post $post)
    {
        // Delete picture file if exists
        if ($post->picture) {
            $picturePath = storage_path('app/public/' . $post->picture);
            if (file_exists($picturePath)) {
                unlink($picturePath);
            }
        }

        // Delete post from database
        $post->delete();

        return redirect('/posts')->with('success', 'Post deleted successfully.');
    }
}
