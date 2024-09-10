import React, { useState, useEffect } from 'react';
import { LuSend } from 'react-icons/lu';
import { useUser } from '@clerk/clerk-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AnswerButton from './answer-button';
import CommentOnComment from './comment-on-comment';
import DeleteComment from './delete-comment';

function CommentSection({ threadId, creatorId, commentAnswerId, onAnswerSelect, category }: CommentSectionProps): JSX.Element {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { user } = useUser();
  const { toast } = useToast();

  // Hämta alla kommentarer från localStorage när tråden laddas
  useEffect(() => {
    const storedComments: ForumComment[] = JSON.parse(localStorage.getItem('comments') || '[]');
    const threadComments = storedComments.filter((comment: ForumComment) => comment.threadId === threadId); // Lägg till typ för comment här
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
        isModerator: !!user.publicMetadata?.isModerator, // Se till att detta hanteras korrekt
      },
      creationDate: new Date().toISOString(),
      replies: [], // Initiera replies som en tom array
    };

    // Uppdatera kommentarer i state och localStorage
    const storedComments = JSON.parse(localStorage.getItem('comments') || '[]');
    const updatedComments = [...storedComments, newCommentObj];
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    setComments(updatedComments.filter((comment: ForumComment) => comment.threadId === threadId)); // Typ här också
    setNewComment('');
  };

  // Hantera borttagning av en kommentar
  const handleDeleteComment = (commentId: number) => {
    const storedComments = JSON.parse(localStorage.getItem('comments') || '[]');
    const updatedComments = storedComments.filter((comment: ForumComment) => comment.id !== commentId); // Typ här
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    setComments(updatedComments.filter((comment: ForumComment) => comment.threadId === threadId)); // Typ här
  };

  // Hantera att lägga till ett svar på en kommentar
  const handleAddReply = (commentId: number, reply: string) => {
    const storedComments = JSON.parse(localStorage.getItem('comments') || '[]');
    const updatedComments = storedComments.map((comment: ForumComment) => // Typ här
      comment.id === commentId
        ? {
            ...comment,
            replies: [...(comment.replies || []), { 
              id: Date.now(), 
              threadId, 
              content: reply, 
              creator: { 
                id: user?.id || '', 
                userName: user?.firstName || user?.username || 'Anonymous',
                isModerator: !!user?.publicMetadata?.isModerator,
              },
              creationDate: new Date().toISOString() 
            }],
          }
        : comment
    );
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    setComments(updatedComments.filter((comment: ForumComment) => comment.threadId === threadId)); // Typ här
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
        {comments.map((comment: ForumComment) => { // Typ här också
          const creationDate = new Date(comment.creationDate);
          const isValidDate = !isNaN(creationDate.getTime());
          const isAnswer = comment.id === commentAnswerId;

          // Tillåt både trådskaparen och moderatorer att toggla svaret
          const canToggle = user?.id === creatorId || !!user?.publicMetadata?.isModerator;
          const isModerator = !!user?.publicMetadata?.isModerator;
          const canDelete = user?.id === comment.creator.id || isModerator; // Kontrollera raderingstillgång

          return (
            <li key={comment.id} className="py-4 border-t">
              <div className='flex justify-between text-xs my-4'>
                <p>{comment.creator.userName}</p>
                <p>{isValidDate ? `${formatDistanceToNow(creationDate)} ago` : 'Invalid date'}</p>

                {/* Rendera bara AnswerButton om kategorin är QNA */}
                {category === 'QNA' && (
                  <AnswerButton
                    isAnswer={isAnswer}
                    canToggle={canToggle} // Nu kan både trådskaparen och moderatorn toggla
                    category={category}
                    onToggle={() => handleAnswerToggle(comment.id)}
                  />
                )}
              </div>
              <div className='flex justify-between'>
                <p className='text-sm'>{comment.content}</p>
                <DeleteComment
                  creatorId={comment.creator.id}
                  commentId={comment.id}
                  userId={user?.id || ''}
                  isModerator={isModerator}
                  onDelete={handleDeleteComment}
                />
              </div>
              <CommentOnComment
                commentId={comment.id}
                replies={comment.replies || []}
                onAddReply={handleAddReply}
                onDeleteReply={(replyId) => {
                  const updatedReplies = comment.replies?.filter(reply => reply.id !== replyId) || [];
                  const updatedComments = comments.map((c: ForumComment) => // Typ här
                    c.id === comment.id ? { ...c, replies: updatedReplies } : c
                  );
                  setComments(updatedComments);
                  localStorage.setItem('comments', JSON.stringify(updatedComments));
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CommentSection;
