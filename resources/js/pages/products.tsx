import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ProductFormModal from '@/components/ProductFormModal';
import Swal from 'sweetalert2';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image?: string;
    category: string;
    stock: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    products: Product[];
}

export default function Products({ products = [] }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (product: Product) => {
        Swal.fire({
            title: 'Hapus Product?',
            text: `Yakin ingin menghapus "${product.name}"? Data tidak bisa dikembalikan!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/products/${product.id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Product berhasil dihapus.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Gagal menghapus product. Silakan coba lagi.',
                            icon: 'error'
                        });
                    }
                });
            }
        });
    };

    const handleSuccess = (message: string, type: 'success' | 'error') => {
        Swal.fire({
            title: type === 'success' ? 'Berhasil!' : 'Error!',
            text: message,
            icon: type,
            timer: 2000,
            showConfirmButton: false
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null); // Reset selected product saat modal ditutup
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    return (
        <AppLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                                    <p className="text-gray-600 mt-1">Kelola data produk Anda</p>
                                </div>
                                <button
                                    onClick={handleCreate}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                >
                                    Tambah Product
                                </button>
                            </div>

                            {products.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Belum Ada Products
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Mulai tambahkan product pertama Anda!
                                    </p>
                                    <button
                                        onClick={handleCreate}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                    >
                                        Tambah Product Pertama
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            {product.image && (
                                                <div className="aspect-w-16 aspect-h-9">
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="w-full h-48 object-cover rounded-t-lg"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                        {product.name}
                                                    </h3>
                                                    <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                        {product.category}
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {product.description}
                                                </p>

                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xl font-bold text-green-600">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Stock: {product.stock}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal untuk tambah/edit product */}
            <ProductFormModal
                isOpen={isModalOpen}
                closeModal={handleCloseModal}
                product={selectedProduct}
                onSuccess={handleSuccess}
            />
        </AppLayout>
    );
}
