import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { createPortal } from "react-dom";

interface Product {
    id?: number;
    name: string;
    price: number;
    description: string;
    image?: string;
    category: string;
    stock: number;
}

interface ProductFormData {
    id?: number;
    name: string;
    price: number | string;
    description: string;
    image?: string;
    category: string;
    stock: number | string;
}

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    product?: Product | null;
    onSuccess?: (message: string, type: 'success' | 'error') => void;
}

export default function ProductFormModal({ isOpen, closeModal, product, onSuccess }: Props) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
        stock: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    // Reset form ketika modal dibuka/ditutup atau product berubah
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                category: product.category,
                stock: product.stock
            });

            // Set preview untuk gambar yang sudah ada
            if (product.image) {
                setPreview(`/storage/${product.image}`);
            } else {
                setPreview("");
            }
            setSelectedFile(null);
        } else {
            setFormData({
                name: "",
                price: "",
                description: "",
                image: "",
                category: "",
                stock: ""
            });
            setPreview("");
            setSelectedFile(null);
        }
    }, [product]);

    // Handle tombol escape dan scroll lock pada body
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
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
    }, [isOpen, closeModal]);

    // Handle perubahan input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            // Izinkan string kosong agar bisa dihapus, convert ke number saat submit
            setFormData({
                ...formData,
                [name]: value === '' ? '' : parseFloat(value) || ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle upload file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Handle submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Konversi nilai string ke number untuk validasi
        const priceValue = typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price;
        const stockValue = typeof formData.stock === 'string' ? parseInt(formData.stock) : formData.stock;

        // Validasi angka
        if (isNaN(priceValue) || priceValue < 0) {
            alert('Harga harus berupa angka yang valid dan tidak boleh negatif');
            return;
        }
        if (isNaN(stockValue) || stockValue < 0) {
            alert('Stock harus berupa angka yang valid dan tidak boleh negatif');
            return;
        }

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('price', priceValue.toString());
        submitData.append('description', formData.description);
        submitData.append('category', formData.category);
        submitData.append('stock', stockValue.toString());

        if (selectedFile) {
            submitData.append('image', selectedFile);
        }

        if (product?.id) {
            // Update produk yang sudah ada
            submitData.append('_method', 'PUT');
            router.post(`/products/${product.id}`, submitData, {
                forceFormData: true,
                onSuccess: () => {
                    onSuccess?.('Product berhasil diperbarui!', 'success');
                    closeModal();
                },
                onError: (errors) => {
                    onSuccess?.('Gagal memperbarui product. Silakan coba lagi.', 'error');
                    console.log('Update errors:', errors);
                }
            });
        } else {
            // Buat produk baru
            router.post('/products', submitData, {
                forceFormData: true,
                onSuccess: () => {
                    onSuccess?.('Product berhasil ditambahkan!', 'success');
                    closeModal();
                },
                onError: (errors) => {
                    onSuccess?.('Gagal menambahkan product. Silakan coba lagi.', 'error');
                    console.log('Create errors:', errors);
                }
            });
        }
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
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
                    maxWidth: '32rem',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    zIndex: 1000000
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {product ? 'Edit Product' : 'Tambah Product Baru'}
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Product
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Harga (IDR)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                Stock
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Kategori
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Elektronik">Elektronik</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Makanan">Makanan</option>
                            <option value="Olahraga">Olahraga</option>
                            <option value="Kesehatan">Kesehatan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                            Gambar Product (Opsional)
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
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
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            {product ? 'Update' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
