import React, { useState, useEffect } from 'react';
import { LuSend } from 'react-icons/lu';
import { useUser } from '@clerk/clerk-react';
import { formatDistanceToNow } from 'date-fns';

import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AnswerButton from './answer-button';

interface CommentSectionProps {
  threadId: number;
  creatorId: string; // Skaparen av tråden
  commentAnswerId?: number; // Vilken kommentar är markerad som svaret?
  onAnswerSelect: (commentId: number | null) => void; // Callback när ett svar väljs eller avmarkeras
  category: string; // Kategorin för tråden
}

interface ForumComment {
  id: number;
  threadId: number;
  content: string;
  creator: {
    id: string;
    userName: string;
  };
  creationDate: string;
}

function CommentSection({ threadId, creatorId, commentAnswerId, onAnswerSelect, category }: CommentSectionProps): JSX.Element {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const storedComments: ForumComment[] = JSON.parse(localStorage.getItem('comments') || '[]');
    
    const threadComments = storedComments.filter(comment => comment.threadId === threadId);
    setComments(threadComments);
  }, [threadId]);

  const handleAddComment = () => {
    if (newComment.trim() === '' || !user) {
      toast({
        title: "Oops!",
        description: newComment.trim() === '' ? "Comment cannot be empty." : "Please sign-in to add a comment.",
      });
      return;
    }

    const newCommentObj: ForumComment = {
      id: Date.now(),
      threadId: threadId,
      content: newComment,
      creator: { 
        id: user.id, 
        userName: user.firstName || user.username || 'Anonymous',
      },
      creationDate: new Date().toISOString(),
    };

    const storedComments = JSON.parse(localStorage.getItem('comments') || '[]');
    const threadComments = storedComments.filter((comment: ForumComment) => comment.threadId === threadId);
    const updatedComments = [...threadComments, newCommentObj];

    const allComments = [...storedComments.filter((comment: ForumComment) => comment.threadId !== threadId), ...updatedComments];
    localStorage.setItem('comments', JSON.stringify(allComments));

    setComments(updatedComments);
    setNewComment('');
  };

  const handleAnswerToggle = (commentId: number) => {
    if (commentId === commentAnswerId) {
      onAnswerSelect(null); // Avmarkera svaret
    } else {
      onAnswerSelect(commentId); // Markera kommentaren som svaret
    }
  };

  return (
    <div>
      <div className='flex justify-center items-center gap-2 m-5'>
        <Input
          className='mt-4'
          type='text'
          placeholder='Add a comment...'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className='mt-4' onClick={handleAddComment}>
          <LuSend style={{ fontSize: '1.7rem' }} />
        </button>
      </div>

      <ul>
        {comments.map((comment) => {
          const creationDate = new Date(comment.creationDate);
          const isValidDate = !isNaN(creationDate.getTime());
          const isAnswer = comment.id === commentAnswerId;
          const canToggle = user?.id === creatorId; // Endast skaparen kan toggla svaret

          return (
            <li key={comment.id} className="py-4 border-t">
              <div className='flex justify-between text-xs my-4'>
                <p>{comment.creator.userName}</p>
                <p>{isValidDate ? `${formatDistanceToNow(creationDate)} ago` : 'Invalid date'}</p>

                {/* Rendera bara AnswerButton om kategorin är QNA */}
                {category === 'QNA' && (
                  <AnswerButton
                    isAnswer={isAnswer}
                    canToggle={canToggle}
                    category={category}
                    onToggle={() => handleAnswerToggle(comment.id)}
                  />
                )}
              </div>
              <p className='text-sm'>{comment.content}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CommentSection;
