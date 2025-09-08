import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
}

interface UserFormModalProps {
    user?: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function UserFormModal({ user, isOpen, onClose, onSuccess, onError }: UserFormModalProps) {
    const [formData, setFormData] = useState<User>({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    password: '',
                    password_confirmation: ''
                });
            } else {
                // Force clear form untuk user baru
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: ''
                });
            }
        }
    }, [user, isOpen]);

    // Clear form saat modal ditutup
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            });
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // Validation
        if (!formData.name.trim()) {
            onError('Nama user wajib diisi');
            return;
        }
        
        if (!formData.email.trim()) {
            onError('Email wajib diisi');
            return;
        }

        if (!user && !formData.password) {
            onError('Password wajib diisi untuk user baru');
            return;
        }

        if (formData.password && formData.password !== formData.password_confirmation) {
            onError('Konfirmasi password tidak cocok');
            return;
        }

        setIsSubmitting(true);

        const submitData: Record<string, string> = {
            name: formData.name.trim(),
            email: formData.email.trim(),
        };

        if (formData.password) {
            submitData.password = formData.password;
            submitData.password_confirmation = formData.password_confirmation || '';
        }

        const options = {
            onSuccess: () => {
                setIsSubmitting(false);
                onSuccess(user ? 'User berhasil diupdate!' : 'User berhasil ditambahkan!');
                onClose();
            },
            onError: (errors: unknown) => {
                setIsSubmitting(false);
                const errorMessage = typeof errors === 'object' && errors ? 
                    Object.values(errors as Record<string, unknown>).flat().join(', ') : 'Terjadi kesalahan';
                onError(errorMessage);
            }
        };

        if (user?.id) {
            router.put(`/users/${user.id}`, submitData, options);
        } else {
            router.post('/users', submitData, options);
        }
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
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
                    padding: '0',
                    width: '100%',
                    maxWidth: '28rem',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    zIndex: 1000000
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {user ? 'Edit User' : 'Tambah User Baru'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isSubmitting}
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4" autoComplete="off">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan nama user"
                            autoComplete="off"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="user@example.com"
                            autoComplete="new-email"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password {!user && <span className="text-red-500">*</span>}
                            {user && <span className="text-gray-500">(kosongkan jika tidak ingin mengubah)</span>}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan password"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            required={!user}
                        />
                    </div>

                    {/* Password Confirmation Field */}
                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                            Konfirmasi Password {!user && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ulangi password"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            required={!user}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {user ? 'Mengupdate...' : 'Menyimpan...'}
                                </>
                            ) : (
                                user ? 'Update User' : 'Simpan User'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
