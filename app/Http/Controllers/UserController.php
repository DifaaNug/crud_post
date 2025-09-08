<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return Inertia::render('users', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // Only update password if provided
        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return redirect()->route('users.index')->with('success', 'User berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus!');
    }

    /**
     * Export users to CSV.
     */
    public function exportCsv()
    {
        try {
            Log::info('Export CSV request started');
            
            // Get all users with necessary data
            $users = User::select([
                'id', 
                'name', 
                'email', 
                'email_verified_at',
                'created_at',
                'updated_at'
            ])->get();

            Log::info('Users fetched for export', ['count' => $users->count()]);

            if ($users->isEmpty()) {
                Log::warning('No users found for export');
                return response()->json(['error' => 'No users found to export'], 404);
            }

            // Generate filename with timestamp
            $filename = 'users_export_' . now()->format('Y_m_d_H_i_s') . '.csv';
            
            Log::info('Starting CSV generation', ['filename' => $filename]);

            // Create response with proper headers
            $response = new StreamedResponse(function () use ($users) {
                $handle = fopen('php://output', 'w');
                
                // Add UTF-8 BOM for proper Excel compatibility
                fwrite($handle, "\xEF\xBB\xBF");
                
                // Add CSV headers
                fputcsv($handle, [
                    'ID',
                    'Name',
                    'Email',
                    'Email Verified',
                    'Created Date',
                    'Updated Date'
                ]);

                // Add user data
                foreach ($users as $user) {
                    fputcsv($handle, [
                        $user->id,
                        $user->name,
                        $user->email,
                        $user->email_verified_at ? 'Yes' : 'No',
                        $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : '',
                        $user->updated_at ? $user->updated_at->format('Y-m-d H:i:s') : ''
                    ]);
                }

                fclose($handle);
            });

            // Set proper headers for file download
            $response->headers->set('Content-Type', 'text/csv; charset=utf-8');
            $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
            $response->headers->set('X-Accel-Buffering', 'no'); // For nginx
            
            Log::info('CSV export completed successfully');
            
            return $response;

        } catch (\Exception $e) {
            Log::error('Export CSV failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Export failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
