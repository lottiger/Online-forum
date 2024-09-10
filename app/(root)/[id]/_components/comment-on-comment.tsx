import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs'; // Använd Clerk för användarhantering
import { Input } from '@/components/ui/input'; // Input-komponent
import { LuSend } from 'react-icons/lu';
import { useToast } from '@/hooks/use-toast'; // Lägg till toast för meddelanden

const CommentOnComment = ({ commentId, onAddReply }: CommentOnCommentProps): JSX.Element => {
  const [reply, setReply] = useState('');
  const { user } = useUser();
  const { toast } = useToast(); // Använd toast för att visa meddelanden

  const handleAddReply = () => {
    if (reply.trim() === '' || !user) {
      // Hantera tomma svar eller icke-inloggade användare
      toast({
        title: "Error",
        description: reply.trim() === '' ? "Reply cannot be empty" : "Please sign in to reply",
      });
      return;
    }

    onAddReply(commentId, reply);
    setReply(''); // Töm fältet efter att svaret har lagts till
  };

  return (
    <div className='mt-2 flex gap-2'>
      <Input
        type='text'
        placeholder='Reply...'
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button onClick={handleAddReply}><LuSend style={{ fontSize: '1.3rem' }} /></button>
    </div>
  );
};

export default CommentOnComment;
