import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ProductFormModal from '@/components/ProductFormModal';
import ExportButton from '@/components/ExportButton';
import { exportProducts } from '@/utils/exportHelpers';
import ArchiveButton from '@/components/ArchiveButton';
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

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                                    <p className="text-gray-600 mt-1">Kelola data produk Anda</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <ExportButton
                                        label="📦 Export Products"
                                        onExport={async () => {
                                            await exportProducts();
                                        }}
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    />
                                    <button
                                        onClick={handleCreate}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                                    >
                                        Tambah Product
                                    </button>
                                </div>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col h-full">
                                            {product.image && (
                                                <div className="w-full aspect-[4/3] mb-3 overflow-hidden flex items-center justify-center bg-gray-100">
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        style={{ maxHeight: '180px' }}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 flex flex-col justify-between space-y-2">
                                                {/* Header dengan nama dan kategori */}
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 truncate">
                                                        {product.name}
                                                    </h3>
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded w-fit truncate">
                                                        {product.category}
                                                    </span>
                                                </div>

                                                {/* Deskripsi */}
                                                <p className="text-gray-600 text-sm line-clamp-2 sm:line-clamp-3 truncate">
                                                    {product.description}
                                                </p>

                                                {/* Harga dan Stock */}
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                    <span className="text-lg sm:text-xl font-bold text-green-600">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Stock: {product.stock}
                                                    </span>
                                                </div>

                                                {/* Action buttons - stacked on mobile */}
                                                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t mt-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <ArchiveButton
                                                        itemType="product"
                                                        itemId={product.id}
                                                        itemName={product.name}
                                                        className="w-full sm:w-auto"
                                                        size="sm"
                                                    />
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
