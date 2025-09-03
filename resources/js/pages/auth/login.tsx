import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Head, router } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail} from 'lucide-react';
import Swal from 'sweetalert2';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            remember: formData.get('remember') ? 'on' : undefined
        };

        router.post('/login', data, {
            onSuccess: () => {
                setProcessing(false);
                Swal.fire({
                    title: 'Login Berhasil!',
                    text: 'Selamat datang kembali.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#10b981'
                });
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
                const errorMessage = errors.email || errors.password || 'Login gagal. Periksa email dan password Anda.';
                Swal.fire({
                    title: 'Login Gagal!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444'
                });
            }
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4">
                <div className="w-full max-w-md">
                    {/* Header dengan Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang</h1>
                        <p className="text-gray-600 mt-2">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                            <p className="text-sm font-medium text-emerald-700">{status}</p>
                        </div>
                    )}

                    {/* Login Form Card */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-semibold text-center">Login</CardTitle>
                            <CardDescription className="text-center">
                                Masukkan email dan password Anda
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="nama@example.com"
                                            className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                                        />
                                    </div>
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                                tabIndex={5}
                                            >
                                                Lupa password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Masukkan password"
                                            className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                                        />
                                    </div>
                                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-gray-600">
                                        Ingat saya
                                    </Label>
                                </div>

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                            Masuk...
                                        </>
                                    ) : (
                                        'Masuk'
                                    )}
                                </Button>

                                {/* Register Link */}
                                <div className="text-center pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">
                                        Belum punya akun?{' '}
                                        <TextLink
                                            href={register()}
                                            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                                            tabIndex={5}
                                        >
                                            Daftar sekarang
                                        </TextLink>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
