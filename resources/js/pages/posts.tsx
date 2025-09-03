import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import PostFormModal from "@/components/PostFormModal";
import Swal from 'sweetalert2';

export default function Posts() {
    type PostType = { id: number; title: string; content: string; picture?: string };

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

    const handleDelete = (post: PostType) => {
        Swal.fire({
            title: 'Konfirmasi Hapus',
            text: `Apakah Anda yakin ingin menghapus post "${post.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/posts/${post.id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Data berhasil dihapus!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#10b981'
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Gagal menghapus data. Silakan coba lagi.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#ef4444'
                        });
                    }
                });
            }
        });
    }

    return(
        <AppLayout>
            <Head title="Apps CRUD" />

            <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-white text-black shadow-lg rounded-xl">
                <div className="flex justify-end">
                    <button
                        onClick={() => openModal()}
                        className="bg-green-600 text-white rounded px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-green-700 transition shadow-md whitespace-nowrap"
                    >
                        TAMBAH DATA
                    </button>
                </div>

                {/* Desktop Table - Hidden on mobile */}
                <div className="hidden sm:block overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full border-collapse bg-white text-black shadow-sm rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 text-gray-800 border-b">
                                    <th className="p-3 text-left font-semibold w-20">Gambar</th>
                                    <th className="p-3 text-left font-semibold">Judul</th>
                                    <th className="p-3 text-left font-semibold">Konten</th>
                                    <th className="p-3 text-left font-semibold w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts && posts.length > 0 ? (
                                    posts.map((post) => (
                                        <tr key={post.id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="p-3">
                                                {post.picture ? (
                                                    <img
                                                        src={`/storage/${post.picture}`}
                                                        alt={post.title}
                                                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                                        No Picture
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 font-medium">{post.title}</td>
                                            <td className="p-3 text-gray-600">{post.content}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openModal(post)}
                                                        className="bg-blue-500 text-sm text-white rounded px-3 py-1.5 hover:bg-blue-600 transition-colors shadow-sm"
                                                    >
                                                        Ubah
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post)}
                                                        className="bg-red-500 text-sm text-white rounded px-3 py-1.5 hover:bg-red-600 transition-colors shadow-sm"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            Belum ada data post. Klik "TAMBAH DATA" untuk menambah post pertama.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Cards - Shown only on mobile */}
                <div className="sm:hidden space-y-4">
                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        {post.picture ? (
                                            <img
                                                src={`/storage/${post.picture}`}
                                                alt={post.title}
                                                className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                                No Picture
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => openModal(post)}
                                                className="bg-blue-500 text-xs text-white rounded px-3 py-1.5 hover:bg-blue-600 transition-colors shadow-sm"
                                            >
                                                Ubah
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post)}
                                                className="bg-red-500 text-xs text-white rounded px-3 py-1.5 hover:bg-red-600 transition-colors shadow-sm"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Belum ada data post. Klik "TAMBAH DATA" untuk menambah post pertama.
                        </div>
                    )}
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
