<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id')->unique();
            $table->unsignedBigInteger('anecdote_id')->nullable()->after('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('anecdote_id')->references('id')->on('anecdotes');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            //
        });
    }
};
