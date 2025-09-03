import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Products() {
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
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                                    Tambah Product
                                </button>
                            </div>

                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Halaman Products
                                </h3>
                                <p className="text-gray-500">
                                    CRUD functionality akan segera ditambahkan!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
