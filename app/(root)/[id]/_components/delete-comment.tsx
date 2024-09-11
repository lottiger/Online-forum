import React from 'react';
import { CiTrash } from "react-icons/ci";

const DeleteComment = ({ creatorId, commentId, userId, isModerator, onDelete }: DeleteCommentProps): JSX.Element => {
  // Kontrollera om den inloggade användaren är moderator eller skaparen av kommentaren
  const canDelete = isModerator || userId === creatorId;

  const handleDelete = () => {
    if (canDelete) {
      const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
      if (confirmDelete) {
        onDelete(commentId); // Anropa onDelete callback
      }
    }
  };

  return (
    <div>
      {canDelete && (
        <button onClick={handleDelete} aria-label="Delete Comment" className="hover:text-red-700 duration-300">
          <CiTrash style={{ fontSize: '1.3rem' }} />
          
        </button>
      )}
    </div>
  );
};

export default DeleteComment;
