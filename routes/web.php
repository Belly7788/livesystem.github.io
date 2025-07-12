<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('App/Dasboard/Home');
});

Route::get('/system/user', function () {
    return inertia('App/User/User');
});


