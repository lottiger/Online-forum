import React, { useState, useEffect } from 'react';
import { LuSend } from 'react-icons/lu';
import { useUser } from '@clerk/clerk-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AnswerButton from './answer-button';
import CommentOnComment from './comment-on-comment';

const CommentSection = ({ threadId, creatorId, commentAnswerId, onAnswerSelect, category }: CommentSectionProps): JSX.Element => {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { user } = useUser();
  const { toast } = useToast();

  // Hämta alla kommentarer från localStorage när tråden laddas
  useEffect(() => {
    const storedComments: ForumComment[] = JSON.parse(localStorage.getItem('comments') || '[]');
    
    // Filtrera ut kommentarerna som tillhör den aktuella tråden
    const threadComments = storedComments.filter(comment => comment.threadId === threadId);
    setComments(threadComments);
  }, [threadId]);

  // Lägg till en ny kommentar
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
      replies: [], // Initiera replies som en tom array
    };

    // Hämta alla kommentarer från localStorage (för alla trådar)
    const storedComments: ForumComment[] = JSON.parse(localStorage.getItem('comments') || '[]');

    // Lägg till den nya kommentaren för den aktuella tråden
    const updatedComments = [...storedComments, newCommentObj];

    // Spara uppdaterade kommentarer tillbaka till localStorage
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    // Uppdatera state med de nya kommentarerna för den specifika tråden
    setComments(updatedComments.filter(comment => comment.threadId === threadId));
    setNewComment('');
  };

  // Hantera att lägga till ett svar på en kommentar
  const handleAddReply = (commentId: number, reply: string) => {
    // Hämta alla kommentarer från localStorage (för alla trådar)
    const storedComments: ForumComment[] = JSON.parse(localStorage.getItem('comments') || '[]');

    // Hitta rätt kommentar och uppdatera dess svar (replies)
    const updatedComments = storedComments.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            replies: [...(comment.replies || []), { 
              id: Date.now(), 
              threadId, 
              content: reply, 
              creator: { 
                id: user?.id || '', 
                userName: user?.firstName || user?.username || 'Anonymous' 
              }, 
              creationDate: new Date().toISOString() 
            }],
          }
        : comment
    );

    // Spara de uppdaterade kommentarerna tillbaka till localStorage
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    // Uppdatera state med kommentarerna för den aktuella tråden
    setComments(updatedComments.filter(comment => comment.threadId === threadId));
  };

  // Hantera toggling av en kommentar som "svar"
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
          <LuSend style={{ fontSize: '1.3rem' }} />
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
              <CommentOnComment commentId={comment.id} onAddReply={handleAddReply} />
              {comment.replies && comment.replies.map(reply => (
                <div key={reply.id} className='ml-4 mt-2'>
                  <p className='text-xs'>{reply.creator.userName}</p>
                  <p className='text-sm'>{reply.content}</p>
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CommentSection;
