import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Archive() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AppLayout>
            <Head title="SIADIL - Sistem Arsip Digital" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">SIADIL</h1>
                                <p className="text-gray-600 text-sm">Sistem Arsip Digital</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Search Document..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-3 py-2 w-64 border border-gray-300 rounded focus:outline-none focus:border-[#057A3C]"
                                />
                                <button
                                    onClick={() => alert('Add New Document clicked!')}
                                    className="bg-[#057A3C] hover:bg-[#046732] text-white px-4 py-2 rounded font-medium"
                                >
                                    + Add New Document
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4 text-[#057A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        <span>›</span>
                        <span className="text-gray-900">Root</span>
                    </div>

                    {/* 2 Column Layout */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Column - Main Documents */}
                        <div className="col-span-8">
                            {/* Documents Section */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>

                                {/* Filter Controls */}
                                <div className="bg-white border border-gray-200 rounded p-3 mb-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <input
                                            type="text"
                                            placeholder="Filter documents..."
                                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#057A3C] w-48"
                                        />
                                        <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                            Archive
                                        </button>
                                        <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                            Date
                                        </button>
                                        <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                            Expire
                                        </button>
                                        <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                            Export
                                        </button>
                                        <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                                            View
                                        </button>
                                    </div>
                                </div>

                                {/* Documents Table */}
                                <div className="bg-white border border-gray-200 rounded">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                                        <div>ID</div>
                                        <div>Number & Title</div>
                                        <div>Description</div>
                                        <div>Document Date</div>
                                    </div>

                                    {/* Document Rows */}
                                    <div className="divide-y divide-gray-200">
                                        <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer">
                                            <div className="text-sm font-medium text-gray-900">#75658</div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">DTS 3.1</div>
                                                <div className="text-gray-500 text-xs">DTS-3.1</div>
                                            </div>
                                            <div className="text-sm text-gray-900">Digital Transformation Strategy</div>
                                            <div className="text-sm">
                                                <div className="text-gray-600">2024-09-10</div>
                                                <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded mt-1 inline-block">Active</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer">
                                            <div className="text-sm font-medium text-gray-900">#75659</div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">SSL Certificate</div>
                                                <div className="text-gray-500 text-xs">SSL-001</div>
                                            </div>
                                            <div className="text-sm text-gray-900">SSL Certificate for pupuk-kujang.co.id</div>
                                            <div className="text-sm">
                                                <div className="text-gray-600">2024-08-15</div>
                                                <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded mt-1 inline-block">Expired</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer">
                                            <div className="text-sm font-medium text-gray-900">#75660</div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">Network Documentation</div>
                                                <div className="text-gray-500 text-xs">NET-DOC-01</div>
                                            </div>
                                            <div className="text-sm text-gray-900">Network Infrastructure Documentation</div>
                                            <div className="text-sm">
                                                <div className="text-gray-600">2024-09-01</div>
                                                <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded mt-1 inline-block">Active</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="col-span-4 space-y-6">
                            {/* Archives Section */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Archives</h2>
                                <div className="space-y-3">
                                    {/* Personal Archive */}
                                    <div
                                        onClick={() => alert('Personal Archive clicked!')}
                                        className="bg-white border border-gray-200 rounded p-4 hover:border-[#057A3C] cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Personal</h3>
                                                <p className="text-sm text-gray-500">12231149</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TIK Archive */}
                                    <div
                                        onClick={() => alert('TIK Archive clicked!')}
                                        className="bg-white border border-gray-200 rounded p-4 hover:border-[#057A3C] cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">TIK</h3>
                                                <p className="text-sm text-gray-500">12343523</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* HR Archive */}
                                    <div
                                        onClick={() => alert('HR Archive clicked!')}
                                        className="bg-white border border-gray-200 rounded p-4 hover:border-[#057A3C] cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">HR</h3>
                                                <p className="text-sm text-gray-500">3452352</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reminders Section */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Reminders</h2>
                                <div className="bg-red-50 border border-red-200 rounded p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-red-900">SSL01</h3>
                                            <p className="text-red-700 text-sm">SSL pupuk-kujang.co.id (Non GCP)</p>
                                            <p className="text-sm text-red-600">This document is expired 2 months 21 days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
