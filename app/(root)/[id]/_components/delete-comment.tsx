import React, { useState } from 'react';
import { CiTrash } from "react-icons/ci";
import { useToast } from '@/hooks/use-toast'; // Importera toast-hooken
import { Button } from '@/components/ui/button'; // Använd Button-komponenten

const DeleteComment = ({ creatorId, commentId, userId, isModerator, onDelete }: DeleteCommentProps): JSX.Element => {
  const [isConfirming, setIsConfirming] = useState(false); // För att hantera bekräftelsen
  const { toast } = useToast(); // Använd toast hook

  // Kontrollera om den inloggade användaren är moderator eller skaparen av kommentaren
  const canDelete = isModerator || userId === creatorId;

  const handleDelete = () => {
    if (canDelete) {
      // Visa bekräftelsedialog
      setIsConfirming(true);

      toast({
        title: "Delete comment?",
        description: "Are you sure you want to delete this comment?",
        action: (
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(commentId); // Anropa onDelete callback om användaren bekräftar
              toast({
                title: "Comment Deleted",
                description: "The comment has been successfully deleted.",
              });
              setIsConfirming(false); // Återställ bekräftelsetillståndet
            }}
          >
            Confirm
          </Button>
        ),
      });
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
