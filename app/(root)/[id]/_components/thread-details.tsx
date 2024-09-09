import React, { useEffect, useState } from 'react';
import CommentSection from './comment-section';

const ThreadDetails = ({ threadId }: { threadId: number | undefined }): JSX.Element => {
  const [thread, setThread] = useState<QNAThread | null>(null);

  useEffect(() => {
    if (threadId !== undefined) {
      // Hämta tråden från localStorage
      const storedThreads: Thread[] = JSON.parse(localStorage.getItem('threads') || '[]');
      const foundThread = storedThreads.find((t: Thread) => t.id === threadId);
      setThread(foundThread as QNAThread || null);
    }
  }, [threadId]);

  const handleAnswerSelect = (commentId: number | null) => {
    if (!thread) return;

    // Uppdatera tråden med det nya svaret eller avmarkeringen
    const updatedThread = {
      ...thread,
      commentAnswerId: commentId || undefined,
      isAnswered: !!commentId, // Om det finns ett markerat svar
    };

    // Uppdatera localStorage
    const storedThreads: Thread[] = JSON.parse(localStorage.getItem('threads') || '[]');
    const updatedThreads = storedThreads.map((t: Thread) => (t.id === thread.id ? updatedThread : t));
    localStorage.setItem('threads', JSON.stringify(updatedThreads));

    // Uppdatera lokal state
    setThread(updatedThread);
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className='border p-4 rounded mx-20 mt-10'>
      <h3 className='flex justify-center font-semibold text-lg'>{thread.title}</h3>
      <p className='text-sm'>{thread.description}</p>
      <div className='flex justify-between text-slate-700 mt-4 text-xs'>
        <p>{thread.category}</p>
        <p>{new Date(thread.creationDate).toLocaleDateString()}</p>
        <p>By {thread.creator.userName}</p>
      </div>

      {/* Skicka in props för markering av svar */}
      <CommentSection
        threadId={thread.id}
        creatorId={thread.creator.id}
        commentAnswerId={thread.commentAnswerId}
        onAnswerSelect={handleAnswerSelect}
      />
    </div>
  );
};

export default ThreadDetails;
