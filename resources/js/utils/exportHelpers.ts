import Swal from 'sweetalert2';

interface ExportResponse {
    success: boolean;
    message: string;
    data?: {
        filename: string;
        content: string;
        total_records: number;
    };
    error?: string;
}

/**
 * Download file dari base64 content
 */
export const downloadFromBase64 = (base64Content: string, filename: string) => {
    try {
        // Decode base64 content
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'text/csv;charset=utf-8;' });

        // Create download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Download failed:', error);
        return false;
    }
};

/**
 * Export data dengan API call dan auto download
 */
export const exportData = async (endpoint: string, filters: Record<string, string | number | boolean> = {}) => {
    try {
        // Build query parameters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value.toString());
            }
        });

        const queryString = params.toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        // Make API request
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ExportResponse = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Export failed');
        }

        if (!result.data) {
            throw new Error('No data received from server');
        }

        // Download file
        const downloadSuccess = downloadFromBase64(result.data.content, result.data.filename);

        if (!downloadSuccess) {
            throw new Error('Failed to download file');
        }

        // Show success notification
        Swal.fire({
            title: 'Export Berhasil!',
            text: `${result.data.total_records} records berhasil diexport ke ${result.data.filename}`,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#10b981',
            timer: 3000,
            timerProgressBar: true
        });

        return result.data;

    } catch (error) {
        console.error('Export error:', error);

        // Show error notification
        Swal.fire({
            title: 'Export Gagal!',
            text: error instanceof Error ? error.message : 'Terjadi kesalahan saat export data',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444'
        });

        throw error;
    }
};

/**
 * Export posts dengan filter
 */
export const exportPosts = async (filters: {
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
} = {}) => {
    return await exportData('/api/dashboard/export/posts', filters);
};

/**
 * Export products dengan filter (untuk future implementation)
 */
export const exportProducts = async (filters: {
    category?: string;
    price_min?: number;
    price_max?: number;
    stock_min?: number;
    in_stock?: boolean;
} = {}) => {
    return await exportData('/api/dashboard/export/products', filters);
};

/**
 * Export users menggunakan authenticated request method
 */
export const exportUsers = async () => {
    try {
        // Show loading notification
        Swal.fire({
            title: 'Mengexport Users...',
            text: 'Mohon tunggu sebentar',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Get CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        // Use fetch with authenticated session
        const response = await fetch('/users/export/csv', {
            method: 'GET',
            headers: {
                'Accept': 'text/csv,application/csv,application/octet-stream',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
            },
            credentials: 'same-origin', // This ensures cookies/session are included
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 302) {
                throw new Error('Session expired. Please refresh the page and login again.');
            }
            throw new Error(`Export failed with status: ${response.status}`);
        }

        // Check if response is actually CSV
        const contentType = response.headers.get('content-type');
        if (!contentType || (!contentType.includes('csv') && !contentType.includes('application/octet-stream'))) {
            throw new Error('Invalid response format. Expected CSV file.');
        }

        // Get the blob data
        const blob = await response.blob();
        
        if (blob.size === 0) {
            throw new Error('Export file is empty. No data to download.');
        }
        
        // Create download using URL.createObjectURL
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = generateExportFilename('users');
        link.style.display = 'none';
        
        // Force download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup URL
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);

        // Close loading and show success
        Swal.fire({
            title: 'Export Berhasil!',
            text: 'File users telah berhasil didownload',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#10b981',
            timer: 3000,
            timerProgressBar: true
        });

        return true;

    } catch (error) {
        console.error('Export users error:', error);

        Swal.fire({
            title: 'Export Gagal!',
            text: error instanceof Error ? error.message : 'Terjadi kesalahan saat export. Silakan coba lagi.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444'
        });

        throw error;
    }
};

/**
 * Generate filename dengan timestamp
 */
export const generateExportFilename = (prefix: string, extension: string = 'csv') => {
    const now = new Date();
    const timestamp = now.toISOString()
        .replace(/:/g, '-')
        .replace(/\./g, '-')
        .slice(0, -5); // Remove milliseconds and 'Z'

    return `${prefix}_export_${timestamp}.${extension}`;
};
