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
     * Menampilkan semua data posts dengan pagination, search, dan filter.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Post::query();

            // Search berdasarkan title atau content
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            // Filter berdasarkan status
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            // Filter berdasarkan tanggal (created_at)
            if ($request->has('date_from') && !empty($request->date_from)) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            
            if ($request->has('date_to') && !empty($request->date_to)) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            // Validasi sort_by untuk keamanan
            $allowedSortFields = ['created_at', 'title', 'status', 'updated_at'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'created_at';
            }
            
            // Validasi sort_order
            $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';
            
            $query->orderBy($sortBy, $sortOrder);

            // Pagination dengan custom per_page
            $perPage = $request->get('per_page', 10);
            $perPage = (int) $perPage;
            
            // Batasi per_page maksimal 100
            if ($perPage > 100) {
                $perPage = 100;
            }

            $posts = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Data posts berhasil diambil',
                'data' => $posts,
                'filters' => [
                    'search' => $request->search,
                    'status' => $request->status,
                    'date_from' => $request->date_from,
                    'date_to' => $request->date_to,
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'per_page' => $perPage
                ]
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
