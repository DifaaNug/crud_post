import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import PostFormModal from "@/components/PostFormModal";
import ExportButton from "@/components/ExportButton";
import { exportPosts } from "@/utils/exportHelpers";
import ArchiveButton from "@/components/ArchiveButton";
import Swal from 'sweetalert2';

export default function Posts() {
    type PostType = { id: number; title: string; content: string; picture?: string; status?: string; created_at?: string };

    const { posts } = usePage<{ posts: Array<PostType> }>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

    const openModal = (post?: PostType) => {
        setSelectedPost(post || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    const handleSuccess = (message: string) => {
        Swal.fire({
            title: 'Berhasil!',
            text: message,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#10b981'
        });
        closeModal();
    };

    const handleError = (message: string) => {
        Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444'
        });
    };

    return(
        <AppLayout>
            <Head title="Posts" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
                                    <p className="text-gray-600 mt-1">Kelola artikel dan konten Anda</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <ExportButton
                                        label="📝 Export Posts"
                                        onExport={async () => {
                                            await exportPosts();
                                        }}
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    />
                                    <button
                                        onClick={() => openModal()}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                                    >
                                        Tambah Post
                                    </button>
                                </div>
                            </div>

                            {posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Belum Ada Posts
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Mulai buat artikel pertama Anda!
                                    </p>
                                    <button
                                        onClick={() => openModal()}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                    >
                                        Buat Post Pertama
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table - Hidden on mobile */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full border-collapse bg-white text-black shadow-sm rounded-lg">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-800 border-b">
                                                    <th className="p-4 text-left font-semibold w-24">Gambar</th>
                                                    <th className="p-4 text-left font-semibold">Judul</th>
                                                    <th className="p-4 text-left font-semibold">Konten</th>
                                                    <th className="p-4 text-left font-semibold w-20">Status</th>
                                                    <th className="p-4 text-left font-semibold w-40">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {posts.map((post) => (
                                                    <tr key={post.id} className="border-b hover:bg-gray-50 transition-colors">
                                                        <td className="p-4">
                                                            {post.picture ? (
                                                                <img
                                                                    src={`/storage/${post.picture}`}
                                                                    alt={post.title}
                                                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                                                    📷
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-4 font-medium max-w-xs">
                                                            <div className="line-clamp-2">{post.title}</div>
                                                        </td>
                                                        <td className="p-4 text-gray-600 max-w-sm">
                                                            <div className="line-clamp-3">{post.content}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                post.status === 'published'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {post.status === 'published' ? 'Published' : 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openModal(post)}
                                                                    className="bg-blue-500 text-sm text-white rounded px-3 py-1.5 hover:bg-blue-600 transition-colors shadow-sm"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <ArchiveButton
                                                                    itemType="post"
                                                                    itemId={post.id}
                                                                    itemName={post.title}
                                                                    size="sm"
                                                                    className="text-sm px-3 py-1.5"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards - Shown only on mobile */}
                                    <div className="md:hidden space-y-4">
                                        {posts.map((post) => (
                                            <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                                                <div className="space-y-3">
                                                    {/* Header dengan gambar dan judul */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0">
                                                            {post.picture ? (
                                                                <img
                                                                    src={`/storage/${post.picture}`}
                                                                    alt={post.title}
                                                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-2xl">
                                                                    📷
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{post.title}</h3>
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                post.status === 'published'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {post.status === 'published' ? '✅ Published' : '⏳ Draft'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="text-sm text-gray-600">
                                                        <p className="line-clamp-3">{post.content}</p>
                                                    </div>

                                                    {/* Timestamp */}
                                                    {post.created_at && (
                                                        <div className="text-xs text-gray-400 border-t pt-2">
                                                            Dibuat: {new Date(post.created_at).toLocaleDateString('id-ID')}
                                                        </div>
                                                    )}

                                                    {/* Action buttons */}
                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => openModal(post)}
                                                            className="flex-1 bg-blue-500 text-white rounded px-3 py-2 text-sm hover:bg-blue-600 transition-colors shadow-sm font-medium"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <ArchiveButton
                                                            itemType="post"
                                                            itemId={post.id}
                                                            itemName={post.title}
                                                            size="sm"
                                                            className="flex-1 text-sm px-3 py-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            <PostFormModal
                isOpen={isModalOpen}
                closemodal={closeModal}
                post={selectedPost}
                onSuccess={(message, type) => {
                    if (type === 'success') {
                        handleSuccess(message);
                    } else {
                        handleError(message);
                    }
                }}
            />
        </AppLayout>
    );
}
