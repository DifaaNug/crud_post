import React from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface RestoreButtonProps {
    itemType: 'post' | 'product' | 'user';
    itemId: number;
    itemName: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export default function RestoreButton({
    itemType,
    itemId,
    itemName,
    className = '',
    size = 'md',
    onSuccess,
    onError
}: RestoreButtonProps) {
    const handleRestore = () => {
        Swal.fire({
            title: 'Pulihkan Item?',
            text: `Yakin ingin memulihkan "${itemName}"? Item akan kembali ke daftar aktif.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Pulihkan!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'rounded-md',
                cancelButton: 'rounded-md'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(`/archive/${itemType}s/${itemId}/restore`, {}, {
                    onSuccess: () => {
                        const message = `${itemName} berhasil dipulihkan!`;
                        if (onSuccess) {
                            onSuccess(message);
                        } else {
                            Swal.fire({
                                title: 'Berhasil!',
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
                        const errorMessage = typeof error === 'string' ? error : 'Gagal memulihkan item. Silakan coba lagi.';
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
            onClick={handleRestore}
            className={`bg-green-500 hover:bg-green-600 text-white rounded transition-colors shadow-sm font-medium flex items-center gap-1 ${sizeClasses[size]} ${className}`}
            title={`Pulihkan ${itemName}`}
        >
            <span>↩️</span>
            <span>Pulihkan</span>
        </button>
    );
}
