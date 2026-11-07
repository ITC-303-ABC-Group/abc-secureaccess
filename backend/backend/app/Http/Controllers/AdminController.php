<?php

namespace App\Http\Controllers;

use App\Models\LoginActivity;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'successful_logins' => LoginActivity::where('result', 'success')->count(),
            'failed_logins' => LoginActivity::where('result', '!=', 'success')->count(),
        ]);
    }

    public function users(): JsonResponse
    {
        $users = User::orderByDesc('created_at')->orderByDesc('id')->get()
            ->map(fn (User $user) => $user->toPublic())
            ->values();

        return response()->json(['users' => $users]);
    }

    public function setStatus(Request $request, User $user): JsonResponse
    {
        $data = $request->validate(['status' => ['required', 'in:active,suspended']]);

        if ($user->isAdmin()) {
            return response()->json(['message' => 'Administrator accounts cannot be suspended.'], 422);
        }

        $user->status = $data['status'];
        $user->save();

        // A suspended user is signed out everywhere immediately.
        if ($user->status === 'suspended') {
            $user->tokens()->delete();
        }

        return response()->json(['user' => $user->toPublic()]);
    }

    public function destroyUser(User $user)
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Administrator accounts cannot be deleted.'], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->noContent();
    }

    public function activity(): JsonResponse
    {
        $rows = LoginActivity::orderByDesc('id')->limit(200)->get()
            ->map(fn (LoginActivity $a) => [
                'id' => $a->id,
                'username' => $a->username,
                'role' => $a->role,
                'result' => $a->result,
                'created_at' => $a->created_at,
            ])
            ->values();

        return response()->json(['activity' => $rows]);
    }
}
