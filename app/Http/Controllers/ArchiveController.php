<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ArchiveController extends Controller
{
    /**
     * Display listing of all archived items
     */
    public function index(): Response
    {
        $archivedPosts = Post::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();

        $archivedProducts = Product::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();

        $archivedUsers = User::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();

        $stats = [
            'total' => $archivedPosts->count() + $archivedProducts->count() + $archivedUsers->count(),
            'posts' => $archivedPosts->count(),
            'products' => $archivedProducts->count(),
            'users' => $archivedUsers->count(),
        ];

        return Inertia::render('archive', [
            'posts' => $archivedPosts,
            'products' => $archivedProducts,
            'users' => $archivedUsers,
            'stats' => $stats
        ]);
    }

    /**
     * Archive a post (soft delete)
     */
    public function archivePost(Post $post): RedirectResponse
    {
        try {
            $post->delete(); // Soft delete
            Log::info('Post archived', ['post_id' => $post->id, 'title' => $post->title]);

            return redirect()->back()->with('success', "Post '{$post->title}' berhasil diarsipkan!");
        } catch (\Exception $e) {
            Log::error('Failed to archive post', ['post_id' => $post->id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal mengarsipkan post. Silakan coba lagi.');
        }
    }

    /**
     * Archive a product (soft delete)
     */
    public function archiveProduct(Product $product): RedirectResponse
    {
        try {
            $product->delete(); // Soft delete
            Log::info('Product archived', ['product_id' => $product->id, 'name' => $product->name]);

            return redirect()->back()->with('success', "Product '{$product->name}' berhasil diarsipkan!");
        } catch (\Exception $e) {
            Log::error('Failed to archive product', ['product_id' => $product->id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal mengarsipkan product. Silakan coba lagi.');
        }
    }

    /**
     * Archive a user (soft delete)
     */
    public function archiveUser(User $user): RedirectResponse
    {
        try {
            // Prevent archiving current user
            if (Auth::check() && Auth::user()->id === $user->id) {
                return redirect()->back()->with('error', 'Anda tidak dapat mengarsipkan akun Anda sendiri.');
            }

            $user->delete(); // Soft delete
            Log::info('User archived', ['user_id' => $user->id, 'name' => $user->name]);

            return redirect()->back()->with('success', "User '{$user->name}' berhasil diarsipkan!");
        } catch (\Exception $e) {
            Log::error('Failed to archive user', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal mengarsipkan user. Silakan coba lagi.');
        }
    }

    /**
     * Restore archived post
     */
    public function restorePost($id): RedirectResponse
    {
        try {
            $post = Post::onlyTrashed()->findOrFail($id);
            $post->restore();
            Log::info('Post restored', ['post_id' => $post->id, 'title' => $post->title]);

            return redirect()->back()->with('success', "Post '{$post->title}' berhasil dipulihkan!");
        } catch (\Exception $e) {
            Log::error('Failed to restore post', ['post_id' => $id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal memulihkan post. Silakan coba lagi.');
        }
    }

    /**
     * Restore archived product
     */
    public function restoreProduct($id): RedirectResponse
    {
        try {
            $product = Product::onlyTrashed()->findOrFail($id);
            $product->restore();
            Log::info('Product restored', ['product_id' => $product->id, 'name' => $product->name]);

            return redirect()->back()->with('success', "Product '{$product->name}' berhasil dipulihkan!");
        } catch (\Exception $e) {
            Log::error('Failed to restore product', ['product_id' => $id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal memulihkan product. Silakan coba lagi.');
        }
    }

    /**
     * Restore archived user
     */
    public function restoreUser($id): RedirectResponse
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id);
            $user->restore();
            Log::info('User restored', ['user_id' => $user->id, 'name' => $user->name]);

            return redirect()->back()->with('success', "User '{$user->name}' berhasil dipulihkan!");
        } catch (\Exception $e) {
            Log::error('Failed to restore user', ['user_id' => $id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal memulihkan user. Silakan coba lagi.');
        }
    }

    /**
     * Permanently delete archived post
     */
    public function forceDeletePost($id): RedirectResponse
    {
        try {
            $post = Post::onlyTrashed()->findOrFail($id);
            $title = $post->title;

            // Delete associated image if exists
            if ($post->picture) {
                $imagePath = storage_path('app/public/' . $post->picture);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $post->forceDelete();
            Log::info('Post permanently deleted', ['post_id' => $id, 'title' => $title]);

            return redirect()->back()->with('success', "Post '{$title}' berhasil dihapus permanen!");
        } catch (\Exception $e) {
            Log::error('Failed to permanently delete post', ['post_id' => $id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal menghapus post secara permanen. Silakan coba lagi.');
        }
    }

    /**
     * Permanently delete archived product
     */
    public function forceDeleteProduct($id): RedirectResponse
    {
        try {
            $product = Product::onlyTrashed()->findOrFail($id);
            $name = $product->name;

            // Delete associated image if exists
            if ($product->image) {
                $imagePath = storage_path('app/public/' . $product->image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $product->forceDelete();
            Log::info('Product permanently deleted', ['product_id' => $id, 'name' => $name]);

            return redirect()->back()->with('success', "Product '{$name}' berhasil dihapus permanen!");
        } catch (\Exception $e) {
            Log::error('Failed to permanently delete product', ['product_id' => $id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal menghapus product secara permanen. Silakan coba lagi.');
        }
    }

    /**
     * Permanently delete archived user
     */
    public function forceDeleteUser($id): RedirectResponse
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id);
            $name = $user->name;

            $user->forceDelete();
            Log::info('User permanently deleted', ['user_id' => $id, 'name' => $name]);

            return redirect()->back()->with('success', "User '{$name}' berhasil dihapus permanen!");
        } catch (\Exception $e) {
            Log::error('Failed to permanently delete user', ['user_id' => $id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal menghapus user secara permanen. Silakan coba lagi.');
        }
    }

    /**
     * Get archive statistics for API
     */
    public function getStats()
    {
        try {
            $stats = [
                'totalArchived' => Post::onlyTrashed()->count() + Product::onlyTrashed()->count() + User::onlyTrashed()->count(),
                'archivedPosts' => Post::onlyTrashed()->count(),
                'archivedProducts' => Product::onlyTrashed()->count(),
                'archivedUsers' => User::onlyTrashed()->count(),
                'recentlyArchived' => [
                    'posts' => Post::onlyTrashed()->orderBy('deleted_at', 'desc')->take(5)->get(['id', 'title', 'deleted_at']),
                    'products' => Product::onlyTrashed()->orderBy('deleted_at', 'desc')->take(5)->get(['id', 'name', 'deleted_at']),
                    'users' => User::onlyTrashed()->orderBy('deleted_at', 'desc')->take(5)->get(['id', 'name', 'deleted_at']),
                ]
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Failed to get archive stats', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to get archive statistics'], 500);
        }
    }
}
