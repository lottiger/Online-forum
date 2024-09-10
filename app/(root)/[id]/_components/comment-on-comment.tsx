import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { LuSend } from 'react-icons/lu';
import { formatDistanceToNow } from 'date-fns';
import DeleteComment from './delete-comment';

const CommentOnComment = ({ commentId, replies, onAddReply, onDeleteReply }: CommentOnCommentProps): JSX.Element => {
  const [reply, setReply] = useState('');
  const { user } = useUser();

  // Lägg till svar på kommentar
  const handleAddReply = () => {
    if (reply.trim() === '' || !user) {
      return; // Hantera tomma svar eller icke-inloggade användare
    }

    onAddReply(commentId, reply);
    setReply(''); // Töm fältet efter att svaret har lagts till
  };

  // Hantera borttagning av ett svar
  const handleDeleteReply = (replyId: number) => {
    onDeleteReply(replyId);
  };

  const isModerator = !!user?.publicMetadata?.isModerator;

  return (
    <div className="ml-6">
      <div className='mt-2 flex gap-2'>
        <Input
          type='text'
          placeholder='Reply...'
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button onClick={handleAddReply}>
          <LuSend style={{ fontSize: '1.3rem' }} />
        </button>
      </div>

      {/* Visa alla svar med tidsstämplar */}
      {replies && replies.map((reply) => {
        const creationDate = new Date(reply.creationDate);
        const isValidDate = !isNaN(creationDate.getTime());
        const canManage = user?.id === reply.creator.id || isModerator;

        return (
          <div key={reply.id} className="mt-2 ml-4">
            <div className="flex justify-between text-xs my-2">
              <p>{reply.creator.userName}</p>
              <p>{isValidDate ? `${formatDistanceToNow(creationDate)} ago` : 'Invalid date'}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">{reply.content}</p>
              {canManage && (
                <DeleteComment
                  creatorId={reply.creator.id}
                  commentId={reply.id}
                  userId={user?.id || ''}
                  isModerator={isModerator}
                  onDelete={handleDeleteReply}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentOnComment;
