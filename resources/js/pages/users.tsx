import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import UserFormModal from "@/components/UserFormModal";
import ExportButton from "@/components/ExportButton";
import { exportUsers } from "@/utils/exportHelpers";
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Users() {
    type UserType = {
        id: number;
        name: string;
        email: string;
        email_verified_at?: string;
        created_at?: string;
        updated_at?: string;
    };

    const { users } = usePage<{ users: Array<UserType> }>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    const openModal = (user?: UserType) => {
        setSelectedUser(user || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
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

    const handleDelete = (user: UserType) => {
        Swal.fire({
            title: 'Konfirmasi Hapus',
            text: `Apakah Anda yakin ingin menghapus user "${user.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/users/${user.id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'User berhasil dihapus.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Gagal menghapus user. Silakan coba lagi.',
                            icon: 'error'
                        });
                    }
                });
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
                                    <p className="text-gray-600 mt-1">Kelola data users aplikasi Anda</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <ExportButton
                                        label="👥 Export Users"
                                        onExport={async () => {
                                            await exportUsers();
                                        }}
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    />
                                    <button
                                        onClick={() => openModal()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                                    >
                                        Tambah User
                                    </button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm sm:text-base">Total Users</p>
                                            <p className="text-2xl sm:text-3xl font-bold">{users?.length || 0}</p>
                                        </div>
                                        <div className="text-3xl sm:text-4xl opacity-80">👥</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 sm:p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100 text-sm sm:text-base">Verified Users</p>
                                            <p className="text-2xl sm:text-3xl font-bold">
                                                {users?.filter(user => user.email_verified_at).length || 0}
                                            </p>
                                        </div>
                                        <div className="text-3xl sm:text-4xl opacity-80">✅</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 sm:p-6 text-white col-span-1 sm:col-span-2 md:col-span-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm sm:text-base">Unverified Users</p>
                                            <p className="text-2xl sm:text-3xl font-bold">
                                                {users?.filter(user => !user.email_verified_at).length || 0}
                                            </p>
                                        </div>
                                        <div className="text-3xl sm:text-4xl opacity-80">⚠️</div>
                                    </div>
                                </div>
                            </div>

                            {/* Users Table */}
                            {users && users.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">👥</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Belum Ada Users
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Mulai tambahkan user pertama!
                                    </p>
                                    <button
                                        onClick={() => openModal()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                    >
                                        Tambah User Pertama
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table - Hidden on Mobile */}
                                    <div className="hidden lg:block overflow-x-auto">
                                        <table className="min-w-full table-auto">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users?.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                user.email_verified_at
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-orange-100 text-orange-800'
                                                            }`}>
                                                                {user.email_verified_at ? '✅ Verified' : '⚠️ Unverified'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {user.created_at ? formatDate(user.created_at) : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openModal(user)}
                                                                    className="bg-blue-500 text-sm text-white rounded px-3 py-1.5 hover:bg-blue-600 transition-colors shadow-sm"
                                                                >
                                                                    Ubah
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(user)}
                                                                    className="bg-red-500 text-sm text-white rounded px-3 py-1.5 hover:bg-red-600 transition-colors shadow-sm"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View - Visible on Mobile */}
                                    <div className="block lg:hidden space-y-4">
                                        {users?.map((user) => (
                                            <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-3">
                                                            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                                                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user.email_verified_at
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {user.email_verified_at ? '✅ Verified' : '⚠️ Unverified'}
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-2 mb-4">
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                                                        <p className="text-sm text-gray-900">{user.email}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</label>
                                                        <p className="text-sm text-gray-900">{user.created_at ? formatDate(user.created_at) : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openModal(user)}
                                                        className="flex-1 bg-blue-500 text-sm text-white rounded px-3 py-2 hover:bg-blue-600 transition-colors shadow-sm"
                                                    >
                                                        Ubah
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user)}
                                                        className="flex-1 bg-red-500 text-sm text-white rounded px-3 py-2 hover:bg-red-600 transition-colors shadow-sm"
                                                    >
                                                        Hapus
                                                    </button>
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

            {/* User Form Modal */}
            {isModalOpen && (
                <UserFormModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            )}
        </AppLayout>
    );
}
