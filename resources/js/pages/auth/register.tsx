import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail, User} from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4">
                <div className="w-full max-w-md">
                    {/* Header dengan Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang</h1>
                        <p className="text-gray-600 mt-2">Buat akun baru untuk memulai</p>
                    </div>

                    {/* Register Form Card */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-semibold text-center">Daftar</CardTitle>
                            <CardDescription className="text-center">
                                Isi data Anda untuk membuat akun
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Form
                                {...RegisteredUserController.store.form()}
                                resetOnSuccess={['password', 'password_confirmation']}
                                disableWhileProcessing
                                className="space-y-6"
                                onSuccess={() => {
                                    Swal.fire({
                                        title: 'Pendaftaran Berhasil!',
                                        text: 'Akun berhasil dibuat! Selamat bergabung.',
                                        icon: 'success',
                                        confirmButtonText: 'OK',
                                        confirmButtonColor: '#10b981'
                                    });
                                }}
                                onError={() => {
                                    Swal.fire({
                                        title: 'Pendaftaran Gagal!',
                                        text: 'Pendaftaran gagal. Periksa data Anda dan coba lagi.',
                                        icon: 'error',
                                        confirmButtonText: 'OK',
                                        confirmButtonColor: '#ef4444'
                                    });
                                }}
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Name Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                Nama Lengkap
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors" />
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    name="name"
                                                    placeholder="Nama lengkap Anda"
                                                    className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                                                />
                                            </div>
                                            <InputError message={errors.name} />
                                        </div>

                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                Email Address
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    name="email"
                                                    placeholder="nama@example.com"
                                                    className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="Minimal 8 karakter"
                                                    className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                                                />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                                                Konfirmasi Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors" />
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="Ulangi password"
                                                    className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                                                />
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        {/* Register Button */}
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                                            tabIndex={5}
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                                    Mendaftar...
                                                </>
                                            ) : (
                                                'Daftar Sekarang'
                                            )}
                                        </Button>

                                        {/* Login Link */}
                                        <div className="text-center pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-600">
                                                Sudah punya akun?{' '}
                                                <TextLink
                                                    href={login()}
                                                    className="text-emerald-600 hover:text-emerald-700 font-semibold"
                                                    tabIndex={6}
                                                >
                                                    Masuk di sini
                                                </TextLink>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
