<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        \Log::info("REGISTER REQUEST:", $request->all());   // 👈 log frontend data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6,confirmed'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            // 'token' => Str::random(60)   // fake token, frontend just stores it
        ],201);
    }
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response([
                'message' => 'Invalid credentials',
            ], Response::HTTP_UNAUTHORIZED);
        };
        $user = Auth::user();
        // Block shop_owner and admin
        if ($user->role !== 'customer') {
            Auth::logout(); // optional safety
            return response()->json([
                'message' => 'You are not allowed', 
            ], Response::HTTP_FORBIDDEN);
        }

        $token = $user->createToken('token')->plainTextToken;

        // $cookie =cookie('jwt' ,$token , minutes:60* 24);
        // return response([
        //     'message' => "success",
        // ])->withCookie($cookie);

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
    }
    public function user()
    {
      return Auth::user();

    }
}
