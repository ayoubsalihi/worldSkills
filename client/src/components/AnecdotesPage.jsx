import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Anecdote from './Anecdote';
import { useAuth } from '../context/AuthContext';

function AnecdotesPage() {
  const [anecdotes, setAnecdotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newAnecdote, setNewAnecdote] = useState({
    title: '',
    content: ''
  });
  const { currentUser } = useAuth();

  const fetchAnecdotes = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/anecdotes?page=${page}`);
      setAnecdotes(prev => [...prev, ...response.data.anecdotes]);
      setHasMore(response.data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching anecdotes:', err);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  useEffect(() => {
    fetchAnecdotes();
  }, []);

  const handleCreateAnecdote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/anecdotes', newAnecdote, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAnecdotes(prev => [response.data, ...prev]);
      setNewAnecdote({ title: '', content: '' });
      setShowModal(false);
    } catch (err) {
      console.error('Error creating anecdote:', err);
    }
  };

  const handleVote = async (anecdoteId, voteType) => {
    try {
      await axios.put(`'http://localhost:8000/api/anecdotes/${anecdoteId}/vote`, { type: voteType }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setAnecdotes(prev => prev.map(anecdote => {
        if (anecdote.id === anecdoteId) {
          return {
            ...anecdote,
            votes: {
              ...anecdote.votes,
              [voteType]: (anecdote.votes[voteType] || 0) + 1
            }
          };
        }
        return anecdote;
      }));
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleDelete = async (anecdoteId) => {
    try {
      await axios.delete(`http://localhost:8000/api/api/anecdotes/${anecdoteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAnecdotes(prev => prev.filter(anecdote => anecdote.id !== anecdoteId));
    } catch (err) {
      console.error('Error deleting anecdote:', err);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h1>Anecdotes</h1>
        {currentUser && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Anecdote
          </Button>
        )}
      </div>

      <InfiniteScroll
        dataLength={anecdotes.length}
        next={fetchAnecdotes}
        hasMore={hasMore}
        loader={<div className="text-center my-3"><Spinner animation="border" /></div>}
        endMessage={
          <p className="text-center my-3">
            <b>You've seen all anecdotes!</b>
          </p>
        }
      >
        {anecdotes.map(anecdote => (
          <Anecdote 
            key={anecdote.id} 
            anecdote={anecdote} 
            onVote={handleVote} 
            onDelete={handleDelete} 
          />
        ))}
      </InfiniteScroll>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Anecdote</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateAnecdote}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={newAnecdote.title}
                onChange={(e) => setNewAnecdote({ ...newAnecdote, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your anecdote"
                value={newAnecdote.content}
                onChange={(e) => setNewAnecdote({ ...newAnecdote, content: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Anecdote
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AnecdotesPage;