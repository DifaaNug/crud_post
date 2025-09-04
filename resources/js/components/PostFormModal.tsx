import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { createPortal } from "react-dom";

interface Post{
    id?: number;
    title: string;
    content: string;
    picture?: string;
}

interface Props{
    isOpen: boolean;
    closemodal: () => void;
    post?: Post | null;
    onSuccess?: (message: string, type: 'success' | 'error') => void;
}

export default function PostFormModal({isOpen, closemodal, post, onSuccess}: Props){
    const [ formData, setFormData] = useState<Post>({
        title: "",
        content: "",
        picture: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    // Efek untuk reset modal
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                content: post.content,
                picture: post.picture
            });

            // Set preview untuk gambar yang sudah ada
            if (post.picture) {
                setPreview(`/storage/${post.picture}`);
            } else {
                setPreview("");
            }
            setSelectedFile(null);
        } else {
            setFormData({
                title: "",
                content: "",
                picture: ""
            });
            setPreview("");
            setSelectedFile(null);
        }
    }, [post]);

    // Handle escape key and body scroll lock
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closemodal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closemodal]);

    // Pengaturan untuk element input
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
       setFormData({
           ...formData,
           [e.target.name]: e.target.value
       });
    };

    // Pengaturan untuk upload gambar
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       if(e.target.files && e.target.files[0]){
           const file = e.target.files[0];
           setSelectedFile(file);
           setPreview(URL.createObjectURL(file));
       }
    };

    // Handle submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('content', formData.content);

        if (selectedFile) {
            submitData.append('picture', selectedFile);
        }

        if (post?.id) {
            // Update post yang sudah ada
            submitData.append('_method', 'PUT');
            router.post(`/posts/${post.id}`, submitData, {
                forceFormData: true,
                onSuccess: () => {
                    onSuccess?.('Data berhasil diperbarui!', 'success');
                    closemodal();
                },
                onError: (errors) => {
                    onSuccess?.('Gagal memperbarui data. Silakan coba lagi.', 'error');
                    console.log('Update errors:', errors);
                }
            });
        } else {
            // Buat post baru
            router.post('/posts', submitData, {
                forceFormData: true,
                onSuccess: () => {
                    onSuccess?.('Data berhasil ditambahkan!', 'success');
                    closemodal();
                },
                onError: (errors) => {
                    onSuccess?.('Gagal menambahkan data. Silakan coba lagi.', 'error');
                    console.log('Create errors:', errors);
                }
            });
        }
    };

    // Kondisi untuk menampilkan modal
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closemodal();
        }
    };

    const modalContent = (
        <div
            className="modal-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '1rem'
            }}
            onClick={handleBackdropClick}
        >
            <div
                className="modal-content"
                style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    width: '100%',
                    maxWidth: '28rem',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    zIndex: 1000000
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {post ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <button
                        onClick={closemodal}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="picture" className="block text-sm font-medium text-gray-700 mb-2">
                            Picture (Optional)
                        </label>
                        <input
                            type="file"
                            id="picture"
                            name="picture"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {preview && (
                            <div className="mt-2">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={closemodal}
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            {post ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
