<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PostApiController extends Controller
{
    /**
     * Menampilkan semua data posts dengan pagination.
     */
    public function index(): JsonResponse
    {
        try {
            $posts = Post::orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Data posts berhasil diambil',
                'data' => $posts
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menyimpan data post baru.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validasi input
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'required|in:draft,published'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle upload gambar
            $picturePath = null;
            if ($request->hasFile('picture')) {
                $picturePath = $request->file('picture')->store('posts', 'public');
            }

            // Simpan data ke database
            $post = Post::create([
                'title' => $request->title,
                'content' => $request->content,
                'picture' => $picturePath,
                'status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Post berhasil dibuat',
                'data' => $post
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail post berdasarkan ID.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $post = Post::find($id);

            if (!$post) {
                return response()->json([
                    'success' => false,
                    'message' => 'Post tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail post berhasil diambil',
                'data' => $post
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update data post berdasarkan ID.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $post = Post::find($id);

            if (!$post) {
                return response()->json([
                    'success' => false,
                    'message' => 'Post tidak ditemukan'
                ], 404);
            }

            // Validasi input
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'required|in:draft,published'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $picturePath = $post->picture; // Keep existing picture

            // Handle upload gambar baru
            if ($request->hasFile('picture')) {
                // Hapus gambar lama jika ada
                if ($post->picture) {
                    Storage::disk('public')->delete($post->picture);
                }
                $picturePath = $request->file('picture')->store('posts', 'public');
            }

            // Update data
            $post->update([
                'title' => $request->title,
                'content' => $request->content,
                'picture' => $picturePath,
                'status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Post berhasil diupdate',
                'data' => $post->fresh()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hapus post berdasarkan ID.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $post = Post::find($id);

            if (!$post) {
                return response()->json([
                    'success' => false,
                    'message' => 'Post tidak ditemukan'
                ], 404);
            }

            // Hapus gambar jika ada
            if ($post->picture) {
                Storage::disk('public')->delete($post->picture);
            }

            // Hapus data dari database
            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Post berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus post',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
