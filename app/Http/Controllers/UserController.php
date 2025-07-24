<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');

        $query = User::where('status', 1)
            ->with(['role'])
            ->when($search, function ($query, $search) {
                return $query->where('username', 'like', '%' . $search . '%')
                            ->orWhere('full_name', 'like', '%' . $search . '%');
            })
            ->orderBy('id', 'desc');

        $users = $query->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('App/User/User', [
            'users' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
            'roles' => Role::select('id', 'role_name as name')->get(),
            'search' => $search,
            'darkMode' => false,
        ]);
    }

    public function checkUsername(Request $request)
    {
        $username = $request->query('username');
        $exists = User::where('username', $username)->where('status', 1)->exists();
        return response()->json(['exists' => $exists]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'full_name' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|exists:role,id',
            'remark' => 'nullable|string',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'full_name' => $validated['full_name'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'remark' => $validated['remark'],
            'status' => 1,
        ]);

        return redirect()->route('user.index')->with('success', 'User created successfully.');
    }

    public function show($id)
    {
        $user = User::where('status', 1)->with(['role'])->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('status', 1)->findOrFail($id);

        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'full_name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
            'role_id' => 'required|exists:role,id',
            'remark' => 'nullable|string',
        ]);

        $updateData = [
            'username' => $validated['username'],
            'full_name' => $validated['full_name'],
            'role_id' => $validated['role_id'],
            'remark' => $validated['remark'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('user.index')->with('success', 'User updated successfully.');
    }

    public function updateStatus($id)
    {
        $user = User::where('status', 1)->findOrFail($id);
        $user->update(['status' => 0]);
        return redirect()->route('user.index')->with('success', 'User deleted successfully.');
    }
}
