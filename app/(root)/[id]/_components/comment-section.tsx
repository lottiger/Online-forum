import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { LuSend } from 'react-icons/lu';
import { useUser } from '@clerk/clerk-react';
import { formatDistanceToNow } from 'date-fns';

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
        password: 'defaultPassword' // Lägg till ett standardvär för password
      },
      creationDate: new Date().toISOString() // Lägg till aktuellt datum
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
  {comments.map((comment, index) => {
    const creationDate = new Date(comment.creationDate);
    const isValidDate = !isNaN(creationDate.getTime());
    const isFirst = index === 0;
    const isLast = index === comments.length - 1;
    return (
      <li
        key={comment.id}
        className={`py-4 ${!isFirst ? 'border-t' : ''} ${!isLast ? 'border-b' : ''}`}
      >
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