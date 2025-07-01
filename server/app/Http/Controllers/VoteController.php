<?php

namespace App\Http\Controllers\Api;

use App\Models\Vote;
use App\Models\Anacote;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Anecdote;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VoteController extends Controller
{
    /**
     * Store a newly created vote in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'anacote_id' => 'required|exists:anacotes,id',
        ]);

        try {
            $vote = Vote::create([
                'user_id' => Auth::id(),
                'anacote_id' => $validated['anacote_id'],
            ]);

            return response()->json([
                'message' => 'Vote created successfully',
                'vote' => $vote
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Vote creation failed',
                'error' => $e->getMessage()
            ], 409);
        }
    }

    /**
     * Remove the specified vote from storage.
     */
    public function destroy($id)
    {
        try {
            $vote = Vote::where('id', $id)
                        ->where('user_id', Auth::id())
                        ->firstOrFail();

            $vote->delete();

            return response()->json(null, 204);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Vote not found or you do not have permission to delete it'
            ], 404);
        }
    }

    /**
     * Get vote counts for an anacote.
     */
    public function getVoteCount(Anecdote $anacote)
    {
        return response()->json([
            'anacote_id' => $anacote->id,
            'votes_count' => $anacote->votes()->count()
        ]);
    }
}