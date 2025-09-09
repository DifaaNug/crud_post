import React from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface PermanentDeleteButtonProps {
    itemType: 'post' | 'product' | 'user';
    itemId: number;
    itemName: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export default function PermanentDeleteButton({
    itemType,
    itemId,
    itemName,
    className = '',
    size = 'md',
    onSuccess,
    onError
}: PermanentDeleteButtonProps) {
    const handlePermanentDelete = () => {
        Swal.fire({
            title: 'Hapus Permanen?',
            html: `<div class="text-center">
                <p class="text-red-600 font-semibold mb-2">⚠️ PERINGATAN ⚠️</p>
                <p>Yakin ingin menghapus <strong>"${itemName}"</strong> secara permanen?</p>
                <p class="text-red-600 text-sm mt-2">Data yang dihapus <strong>TIDAK DAPAT</strong> dipulihkan!</p>
            </div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus Permanen!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'rounded-md',
                cancelButton: 'rounded-md'
            },
            // Require typing "DELETE" for confirmation
            showDenyButton: false,
            preConfirm: () => {
                return Swal.fire({
                    title: 'Konfirmasi Terakhir',
                    html: `<div class="text-center">
                        <p class="mb-4">Ketik <strong>DELETE</strong> untuk mengkonfirmasi penghapusan permanen:</p>
                        <input id="delete-confirmation" class="swal2-input" placeholder="Ketik DELETE" />
                    </div>`,
                    showCancelButton: true,
                    confirmButtonColor: '#dc2626',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Hapus Permanen',
                    cancelButtonText: 'Batal',
                    preConfirm: () => {
                        const input = document.getElementById('delete-confirmation') as HTMLInputElement;
                        if (input.value !== 'DELETE') {
                            Swal.showValidationMessage('Ketik "DELETE" untuk melanjutkan');
                            return false;
                        }
                        return true;
                    }
                });
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                router.delete(`/archive/${itemType}s/${itemId}/force`, {
                    onSuccess: () => {
                        const message = `${itemName} berhasil dihapus permanen!`;
                        if (onSuccess) {
                            onSuccess(message);
                        } else {
                            Swal.fire({
                                title: 'Terhapus!',
                                text: message,
                                icon: 'success',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#10b981',
                                timer: 3000,
                                timerProgressBar: true
                            });
                        }
                    },
                    onError: (error) => {
                        const errorMessage = typeof error === 'string' ? error : 'Gagal menghapus item secara permanen. Silakan coba lagi.';
                        if (onError) {
                            onError(errorMessage);
                        } else {
                            Swal.fire({
                                title: 'Error!',
                                text: errorMessage,
                                icon: 'error',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#ef4444'
                            });
                        }
                    }
                });
            }
        });
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    return (
        <button
            onClick={handlePermanentDelete}
            className={`bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow-sm font-medium flex items-center gap-1 ${sizeClasses[size]} ${className}`}
            title={`Hapus permanen ${itemName}`}
        >
            <span>💀</span>
            <span>Hapus Permanen</span>
        </button>
    );
}
