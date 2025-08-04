<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\FacebookController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Dasboard/Home');
});


Route::middleware(['auth'])->group(function () {
    Route::get('/system/facebook', [FacebookController::class, 'index'])->name('facebook.index');
    Route::post('/system/facebook/connect', [FacebookController::class, 'store'])->name('facebook.store');
    Route::post('/system/facebook/select-page', [FacebookController::class, 'selectPage'])->name('facebook.select-page');
    Route::post('/system/facebook/disconnect/{facebook_user_id}', [FacebookController::class, 'disconnect'])->name('facebook.disconnect');
});

Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.store');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/system/user', [UserController::class, 'index'])->name('user.index');
    Route::get('/system/user/check-username', [UserController::class, 'checkUsername'])->name('user.check-username');
    Route::post('/system/user', [UserController::class, 'store'])->name('user.store');
    Route::get('/system/user/{id}', [UserController::class, 'show'])->name('user.show');
    Route::put('/system/user/{id}', [UserController::class, 'update'])->name('user.update');
    Route::put('/system/user/{id}/status', [UserController::class, 'updateStatus'])->name('user.status');
});

