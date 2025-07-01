<?php

namespace App\Http\Controllers;

use App\Models\Anecdote;
use Illuminate\Http\Request;

class AnecdoteController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10);
        $offset = $request->input('offset', 0);

        $anecdotes = Anecdote::with(['user', 'votes'])
            ->offset($offset)
            ->limit($limit)
            ->get()
            ->map(function ($anecdote) {
                return [
                    'id' => $anecdote->id,
                    'title' => $anecdote->title,
                    'content' => $anecdote->content,
                    'author' => $anecdote->user->name,
                    'created_at' => $anecdote->created_at->format('Y-m-d H:i:s'),
                    'votes_count' => $anecdote->votes->count()
                ];
            });

        return response()->json($anecdotes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        $anecdote = $request->user()->anecdotes()->create($validated);
        return response()->json($anecdote, 201);
    }

    public function destroy($id)
    {
        $anecdote = Anecdote::findOrFail($id);

        if (auth()->user()->role !== 'admin' && auth()->id() !== $anecdote->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $anecdote->delete();
        return response()->json(['message' => 'Anecdote supprimée']);
    }
}
