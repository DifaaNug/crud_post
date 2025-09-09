import React from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface ArchiveButtonProps {
    itemType: 'post' | 'product' | 'user';
    itemId: number;
    itemName: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export default function ArchiveButton({
    itemType,
    itemId,
    itemName,
    className = '',
    size = 'md',
    onSuccess,
    onError
}: ArchiveButtonProps) {
    const handleArchive = () => {
        Swal.fire({
            title: 'Arsipkan Item?',
            text: `Yakin ingin mengarsipkan "${itemName}"? Item dapat dipulihkan dari halaman arsip.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Arsipkan!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'rounded-md',
                cancelButton: 'rounded-md'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/archive/${itemType}s/${itemId}`, {
                    onSuccess: () => {
                        const message = `${itemName} berhasil diarsipkan!`;
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
                        const errorMessage = typeof error === 'string' ? error : 'Gagal mengarsipkan item. Silakan coba lagi.';
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
            onClick={handleArchive}
            className={`bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors shadow-sm font-medium flex items-center gap-1 ${sizeClasses[size]} ${className}`}
            title={`Arsipkan ${itemName}`}
        >
            <span>📁</span>
            <span>Arsip</span>
        </button>
    );
}
