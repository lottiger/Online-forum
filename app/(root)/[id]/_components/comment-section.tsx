import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { LuSend } from 'react-icons/lu';
import { useUser } from '@clerk/clerk-react';



interface CommentSectionProps {
  threadId: number;
}

function CommentSection({ threadId }: CommentSectionProps): JSX.Element {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { user } = useUser(); // Hämta den inloggade användaren från Clerk

  useEffect(() => {
    // Hämta kommentarer från local storage
    const storedComments: ForumComment[] = JSON.parse(localStorage.getItem('comments') || '[]');
    const threadComments = storedComments.filter(comment => comment.thread === threadId);
    setComments(threadComments);
  }, [threadId]);

  const handleAddComment = () => {
    if (newComment.trim() === '' || !user) return;

    const newCommentObj: ForumComment = {
      id: Date.now(),
      thread: threadId,
      content: newComment,
      creator: { 
        userName: user.fullName || user.username || 'Anonymous',
        password: 'defaultPassword' // Lägg till ett standardvärde för password
      }
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    setNewComment('');

    // Spara kommentarer till local storage
    const storedComments: ForumComment[] = JSON.parse(localStorage.getItem('comments') || '[]');
    localStorage.setItem('comments', JSON.stringify([...storedComments, newCommentObj]));
  };

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <p><strong>{comment.creator.userName}</strong></p>
          </li>
        ))}
      </ul>
      <div className='flex justify-center items-center gap-2 mt-5'>
        <Input
          className='mt-4'
          type='text'
          placeholder='Add a comment...'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className='mt-4' onClick={handleAddComment}>
          <LuSend style={{ fontSize: '2rem' }} />
        </button>
      </div>
    </div>
  );
}

export default CommentSection;