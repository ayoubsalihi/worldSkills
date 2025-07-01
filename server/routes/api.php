<?php

use App\Http\Controllers\AnecdoteController;
use App\Http\Controllers\Api\AnacoteController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\UserController;

Route::post('auth/register', [UserAuthController::class, 'register']);
Route::post('auth/login', [UserAuthController::class, 'login']);
Route::post('auth/logout', [UserAuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'me']);
    Route::post('/anecdotes', [AnecdoteController::class, 'store']);
    Route::delete('/anecdotes/{id}', [AnecdoteController::class, 'destroy']);
    Route::get('/users', [UserController::class, 'index']);
});

Route::get('/anecdotes', [AnecdoteController::class, 'index']);
Route::post('/anecdotes/{id}/vote', [VoteController::class, 'store']);