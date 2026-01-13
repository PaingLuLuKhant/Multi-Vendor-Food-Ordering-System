<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        \Log::info("REGISTER REQUEST:", $request->all());   // 👈 log frontend data
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer'
        ]);

        return response()->json([
            'user' => $user,
            'token' => Str::random(60)   // fake token, frontend just stores it
        ]);
    } 
    public function login(Request $request)
    {
        \Log::info("LOGIN REQUEST:", $request->all());   // 👈 log frontend data

        $request->validate([
            'email'=>'required|email',
            'password'=>'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message'=>'Invalid credentials'],401);
        }

        return response()->json([
            'user' => $user,
            // 'token' => Str::random(60)
        ]);
    }  
}
