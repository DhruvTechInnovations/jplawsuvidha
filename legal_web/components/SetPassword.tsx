"use client"
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff, Check, X, Info } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE_URL = 'https://backend.jplawsuvidha.com/api';
// const API_BASE_URL = 'http://localhost:3001/api';


function SetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const passwordRequirements = [
        { label: 'Minimum 8 characters', met: password.length >= 8 },
        { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'At least one lowercase letter', met: /[a-z]/.test(password) },
        { label: 'At least one number', met: /\d/.test(password) },
        { label: 'At least one special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!passwordRegex.test(password)) {
            setError('Password does not meet the security requirements.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/set-password`, {
                token,
                password
            });

            if (response.data.status === 'success') {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(response.data.message || 'Failed to set password.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Alert variant="destructive" className="max-w-md w-full">
                    <AlertDescription>
                        Invalid request. Missing email parameter.
                        <Link href="/login" className="block mt-2 font-semibold underline">Back to Login</Link>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Set Successfully!</h2>
                    <p className="text-gray-600 mb-6">Your password has been updated. You will be redirected to the login page shortly.</p>
                    <Button onClick={() => router.push('/login')} className="w-full bg-black text-white hover:bg-gray-800">
                        Go to Login Now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden items-center justify-center">

                <div className="relative z-10 w-full max-w-lg px-12">
                    <div className="mb-6 text-center lg:text-left">
                        <div className='flex justify-center mb-4'>
                            <img src="/logo3.avif" alt="JP Law Suvidha Logo" className="h-auto w-[200px] rounded-2xl" />
                        </div>
                        <h1
                            className="text-5xl  mb-4 font-Poppins leading-tight text-center text-white">
                            JP Law Suvidha
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 font-Poppins text-center">Secure your legal practice with a strong password.</p>

                    </div>


                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center p-6 lg:p-8">
                    <Link href='/login' className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Login</span>
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-semibold text-gray-900">Set Your Password</h2>
                            {/* <p className="text-gray-600 mt-2">Create a secure password for your account: <span className="font-medium text-black">{email}</span></p> */}
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 px-4 pt-6 pb-2 border-2 border-gray-400 rounded-lg focus:border-black outline-none transition-all"
                                    placeholder=" "
                                    required
                                />
                                <Label htmlFor="password" className={`absolute left-4 transition-all duration-200 pointer-events-none ${password ? 'top-2 text-xs text-gray-500' : 'top-4 text-base text-gray-400'}`}>
                                    New Password
                                </Label>
                                <button
                                    type="button"
                                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Requirements Checklist */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                                    <Info size={16} className="text-blue-500" />
                                    Password Security Requirements
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {passwordRequirements.map((req, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            {req.met ? (
                                                <Check size={14} className="text-green-600" />
                                            ) : (
                                                <div className="w-3.5 h-3.5 border border-gray-300 rounded-full" />
                                            )}
                                            <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-14 px-4 pt-6 pb-2 border-2 border-gray-400 rounded-lg focus:border-black outline-none transition-all"
                                    placeholder=" "
                                    required
                                />
                                <Label htmlFor="confirmPassword" className={`absolute left-4 transition-all duration-200 pointer-events-none ${confirmPassword ? 'top-2 text-xs text-gray-500' : 'top-4 text-base text-gray-400'}`}>
                                    Confirm Password
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Setting Password...' : 'Set Password'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SetPassword() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SetPasswordForm />
        </Suspense>
    );
}
