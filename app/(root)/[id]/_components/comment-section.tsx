import React, { useState, useEffect } from 'react';
import { LuSend } from 'react-icons/lu';
import { useUser } from '@clerk/clerk-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AnswerButton from './answer-button';
import CommentOnComment from './comment-on-comment';
import DeleteComment from './delete-comment';
import { censorComment } from '@/helpers/forbidden-words';


function CommentSection({ threadId, creatorId, commentAnswerId, onAnswerSelect, category }: CommentSectionProps): JSX.Element {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { user } = useUser();
  const { toast } = useToast();

  // Hämta alla kommentarer från localStorage när tråden laddas
  useEffect(() => {
    const storedComments: ForumComment[] = JSON.parse(localStorage.getItem('comments') || '[]');
    const threadComments = storedComments.filter(comment => comment.threadId === threadId);
    setComments(threadComments);
  }, [threadId]);

  // Lägg till en ny kommentar med censurering
  const handleAddComment = () => {
    if (newComment.trim() === '' || !user) {
      toast({
        title: "Oops!",
        description: newComment.trim() === '' ? "Comment cannot be empty." : "Please sign-in to add a comment.",
      });
      return;
    }

    // Censurera kommentaren innan den läggs till
    const censoredComment = censorComment(newComment);

    const newCommentObj: ForumComment = {
      id: Date.now(),
      threadId: threadId,
      content: censoredComment, // Använd censurerad text
      creator: { 
        id: user.id, 
        userName: user.firstName || user.username || 'Anonymous',
        isModerator: !!user.publicMetadata?.isModerator,
      },
      creationDate: new Date().toISOString(),
      replies: [], // Initiera replies som en tom array
    };

    // Uppdatera kommentarer i state och localStorage
    const updatedComments = [...comments, newCommentObj];
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    setComments(updatedComments);
    setNewComment('');
  };

  // Hantera borttagning av en kommentar
  const handleDeleteComment = (commentId: number) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  // Hantera att lägga till ett svar på en kommentar
  const handleAddReply = (commentId: number, reply: string) => {
    const censoredReply = censorComment(reply); // Censurera svaret innan det läggs till

    const updatedComments = comments.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            replies: [...(comment.replies || []), { 
              id: Date.now(), 
              threadId, 
              content: censoredReply, // Använd censurerad text för svaret
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
    setComments(updatedComments);
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
                    canToggle={canToggle}
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
                  const updatedComments = comments.map(c => 
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
