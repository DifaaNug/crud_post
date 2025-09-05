<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductApiController extends Controller
{
    /**
     * Menampilkan semua data products dengan pagination, search, dan filter.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Product::query();

            // Search berdasarkan name, category, atau description
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Filter berdasarkan category
            if ($request->has('category') && !empty($request->category)) {
                $query->where('category', 'like', "%{$request->category}%");
            }

            // Filter berdasarkan price range
            if ($request->has('price_min') && is_numeric($request->price_min)) {
                $query->where('price', '>=', $request->price_min);
            }
            
            if ($request->has('price_max') && is_numeric($request->price_max)) {
                $query->where('price', '<=', $request->price_max);
            }

            // Filter berdasarkan stock
            if ($request->has('stock_min') && is_numeric($request->stock_min)) {
                $query->where('stock', '>=', $request->stock_min);
            }

            // Filter produk yang out of stock
            if ($request->has('in_stock') && $request->in_stock == 'true') {
                $query->where('stock', '>', 0);
            } elseif ($request->has('in_stock') && $request->in_stock == 'false') {
                $query->where('stock', '=', 0);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            // Validasi sort_by untuk keamanan
            $allowedSortFields = ['created_at', 'name', 'category', 'price', 'stock', 'updated_at'];
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

            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Data products berhasil diambil',
                'data' => $products,
                'filters' => [
                    'search' => $request->search,
                    'category' => $request->category,
                    'price_min' => $request->price_min,
                    'price_max' => $request->price_max,
                    'stock_min' => $request->stock_min,
                    'in_stock' => $request->in_stock,
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'per_page' => $perPage
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menyimpan data product baru.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validasi input
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle upload gambar
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('products', 'public');
            }

            // Simpan data ke database
            $product = Product::create([
                'name' => $request->name,
                'category' => $request->category,
                'price' => $request->price,
                'stock' => $request->stock,
                'description' => $request->description,
                'image' => $imagePath
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product berhasil dibuat',
                'data' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail product berdasarkan ID.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail product berhasil diambil',
                'data' => $product
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update data product berdasarkan ID.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product tidak ditemukan'
                ], 404);
            }

            // Validasi input
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $imagePath = $product->image; // Keep existing image

            // Handle upload gambar baru
            if ($request->hasFile('image')) {
                // Hapus gambar lama jika ada
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $imagePath = $request->file('image')->store('products', 'public');
            }

            // Update data
            $product->update([
                'name' => $request->name,
                'category' => $request->category,
                'price' => $request->price,
                'stock' => $request->stock,
                'description' => $request->description,
                'image' => $imagePath
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product berhasil diupdate',
                'data' => $product->fresh()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hapus product berdasarkan ID.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product tidak ditemukan'
                ], 404);
            }

            // Hapus gambar jika ada
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            // Hapus data dari database
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
