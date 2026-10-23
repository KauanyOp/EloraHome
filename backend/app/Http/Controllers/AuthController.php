<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Exibe a página de cadastro.
    public function showRegister()
    {
        return view('register');
    }

    // Cadastra um novo cliente.
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Cria a conta com senha protegida e perfil de cliente.
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => false,
        ]);

        // Mantém o cliente conectado após o cadastro.
        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/')->with('success', 'Cadastro realizado!');
    }

    // Exibe a página de login.
    public function showLogin()
    {
        return view('login');
    }

    // Verifica os dados de acesso.
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credentials)) {
            return back()->withErrors([
                'email' => 'E-mail ou senha incorretos.',
            ])->onlyInput('email');
        }

        // Renova a sessão após o login.
        $request->session()->regenerate();

        return redirect('/')->with('success', 'Login realizado!');
    }

    // Encerra a sessão do usuário.
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}