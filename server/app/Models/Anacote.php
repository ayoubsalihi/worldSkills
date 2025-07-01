<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anacote extends Model
{
    protected $guarded = [];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function votes(){
        return $this->belongsTo(Vote::class);
    }
}
