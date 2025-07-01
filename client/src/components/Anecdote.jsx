import React from 'react';
import { Card, ButtonGroup, Button, Badge } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Anecdote({ anecdote, onVote, onDelete }) {
  const { currentUser } = useAuth();

  const canDelete = currentUser && 
    (currentUser.id === anecdote.userId || currentUser.role === 'admin');

  const handleVote = (type) => {
    onVote(anecdote.id, type);
  };

  const handleDelete = () => {
    onDelete(anecdote.id);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        {canDelete && (
          <div className="d-flex justify-content-end">
            <Button variant="link" size="sm" onClick={handleDelete} className="text-danger">
              <FaTrash />
            </Button>
          </div>
        )}
        <Card.Title>{anecdote.title}</Card.Title>
        <Card.Text>{anecdote.content}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Posted by {anecdote.user?.username || 'Anonymous'}
          </small>
          <ButtonGroup size="sm">
            <Button variant="outline-secondary" onClick={() => handleVote('bof')}>
              Bof <Badge bg="secondary">{anecdote.votes?.bof || 0}</Badge>
            </Button>
            <Button variant="outline-success" onClick={() => handleVote('excellent')}>
              Excellent <Badge bg="success">{anecdote.votes?.excellent || 0}</Badge>
            </Button>
            <Button variant="outline-info" onClick={() => handleVote('technique')}>
              Technique <Badge bg="info">{anecdote.votes?.technique || 0}</Badge>
            </Button>
            <Button variant="outline-warning" onClick={() => handleVote('wow')}>
              Wow!! <Badge bg="warning">{anecdote.votes?.wow || 0}</Badge>
            </Button>
          </ButtonGroup>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Anecdote;