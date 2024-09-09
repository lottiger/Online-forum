import React, { useState, useEffect } from 'react';
import { LuSend } from 'react-icons/lu';
import { useUser } from '@clerk/clerk-react';
import { formatDistanceToNow } from 'date-fns';

import { useToast } from '@/hooks/use-toast'; // Make sure your toast imports are correctly utilized
import { Input } from '@/components/ui/input';

interface CommentSectionProps {
  threadId: number;
}

interface ForumComment {
  id: number;
  threadId: number;
  content: string;
  creator: {
    id: string; // Ensure ID is string to align with ClerkUser ID format
    userName: string;
  };
  creationDate: string;
}

function CommentSection({ threadId }: CommentSectionProps): JSX.Element {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { user } = useUser(); // Access the logged-in user from Clerk
  const { toast } = useToast(); // Use toast for user notifications

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
        id: user.id, // Use ClerkUser ID directly
        userName: user.firstName || user.username || 'Anonymous', // Use first name or username or default to 'Anonymous'
      },
      creationDate: new Date().toISOString()
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    setNewComment('');

    // Save updated comments to local storage
    localStorage.setItem('comments', JSON.stringify([...comments, newCommentObj]));
  };

  return (
    
      <div>
        <div className='flex justify-center items-center gap-2 mt-5'>
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
            return (
              <li key={comment.id} className="py-4 border-t">
                <div className='flex justify-between text-xs my-4'>
                  <p>{comment.creator.userName}</p>
                  <p>{isValidDate ? `${formatDistanceToNow(creationDate)} ago` : 'Invalid date'}</p>
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
