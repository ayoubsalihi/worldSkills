<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'role' => $request->user()->role
        ]);
    }

    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $users = User::all(['id', 'name', 'email', 'role']);
        return response()->json($users);
    }
}
