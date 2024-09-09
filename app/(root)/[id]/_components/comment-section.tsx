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
  onAnswerSelect: (commentId: number) => void; // Callback när ett svar väljs
}

function CommentSection({ threadId, creatorId, commentAnswerId, onAnswerSelect }: CommentSectionProps): JSX.Element {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch comments from local storage
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

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    setNewComment('');

    // Save updated comments to local storage
    localStorage.setItem('comments', JSON.stringify([...comments, newCommentObj]));
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
          const isAnswer = comment.id === commentAnswerId; // Är den här kommentaren markerad som svaret?

          return (
            <li key={comment.id} className="py-4 border-t">
              <div className='flex justify-between text-xs my-4'>
                <p>{comment.creator.userName}</p>
                <p>{isValidDate ? `${formatDistanceToNow(creationDate)} ago` : 'Invalid date'}</p>

                {/* Endast trådskaparen kan markera ett svar */}
                {user?.id === creatorId && (
                  <AnswerButton
                    isAnswer={isAnswer}
                    onToggle={() => onAnswerSelect(comment.id)} // Callback när kommentaren markeras som svaret
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
