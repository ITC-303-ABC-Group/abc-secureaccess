<?php

namespace App\Http\Controllers;

use App\Models\LoginActivity;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->merge([
            'username' => strtolower(trim((string) $request->input('username'))),
            'email' => strtolower(trim((string) $request->input('email'))),
        ]);

        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'username' => ['required', 'regex:/^[a-z0-9_.]{3,20}$/', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'username.regex' => 'Username must be 3–20 characters: letters, numbers, dots or underscores.',
            'username.unique' => 'That username is already taken.',
            'email.email' => 'Enter a valid email address.',
            'email.unique' => 'An account with that email already exists.',
        ]);

        // New accounts are always plain users (role/status use their database defaults).
        User::create([
            'name' => trim($data['name']),
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => $data['password'], // hashed by the model cast (bcrypt)
        ]);

        return response()->json(['message' => 'Account created.'], 201);
    }

    public function login(Request $request): JsonResponse
    {
        // The "username" field accepts either a username or an email address.
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $identifier = strtolower(trim($credentials['username']));
        $column = str_contains($identifier, '@') ? 'email' : 'username';
        $user = User::where($column, $identifier)->first();

        // No account with that username or email.
        if (! $user) {
            $this->record($request, $identifier, 'unknown', 'failed');

            return response()->json([
                'message' => 'No account exists with that username or email. Create an account first.',
            ], 404);
        }

        // Account exists, wrong password.
        if (! Hash::check($credentials['password'], $user->password)) {
            $this->record($request, $user->username, $user->role, 'failed');

            return response()->json(['message' => 'Incorrect password.'], 401);
        }

        if ($user->status === 'suspended') {
            $this->record($request, $user->username, $user->role, 'blocked');

            return response()->json(['message' => 'This account is suspended. Contact an administrator.'], 403);
        }

        $user->forceFill([
            'previous_login_at' => $user->last_login_at,
            'last_login_at' => now(),
        ])->save();

        $this->record($request, $user->username, $user->role, 'success');

        return response()->json([
            'token' => $user->createToken('abc-secureaccess')->plainTextToken,
            'user' => $user->toPublic(),
        ]);
    }

    /**
     * Forgot password: set a new password straight from the login page.
     * The username and the email must belong to the same account.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->merge([
            'username' => strtolower(trim((string) $request->input('username'))),
            'email' => strtolower(trim((string) $request->input('email'))),
        ]);

        $data = $request->validate([
            'username' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'email.email' => 'Enter a valid email address.',
        ]);

        $user = User::where('username', $data['username'])->first();

        if (! $user) {
            return response()->json(['message' => 'No account exists with that username.'], 404);
        }

        if (strtolower((string) $user->email) !== $data['email']) {
            return response()->json(['message' => 'That email does not match this username.'], 422);
        }

        $user->forceFill(['password' => $data['password']])->save(); // hashed by the model cast

        // Sign the account out everywhere.
        $user->tokens()->delete();

        return response()->json(['message' => 'Password updated. You can log in now.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()->toPublic()]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'different:current_password'],
        ], [
            'password.different' => 'Choose a password different from the current one.',
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update(['password' => $data['password']]);

        // Sign out every other device; keep this one.
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return response()->json(['message' => 'Password updated.']);
    }

    private function record(Request $request, string $username, string $role, string $result): void
    {
        LoginActivity::create([
            'username' => Str::limit($username, 50, ''),
            'role' => $role,
            'result' => $result,
            'ip_address' => $request->ip(),
        ]);
    }
}
