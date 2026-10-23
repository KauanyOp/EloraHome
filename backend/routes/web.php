<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::view('adm/categorias', 'categories');
Route::view('adm/produtos', 'products');
Route::view('adm/usuarios', 'users');
Route::view('adm/pedidos', 'orders');
// Cadastro e login.
Route::get('/cadastro', [AuthController::class, 'showRegister']);
Route::post('/cadastro', [AuthController::class, 'register']);

Route::get('/login', [AuthController::class, 'showLogin']);
Route::post('/login', [AuthController::class, 'login']);

// Logout disponível somente para usuários autenticados.
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth');
