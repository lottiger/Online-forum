
import React, { useEffect, useState } from 'react';

import CommentSection from './comment-section';



const ThreadDetails = ({ threadId }: { threadId: number | undefined }): JSX.Element => {
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    if (threadId !== undefined) {
      // Hämta tråden från localStorage
      const storedThreads: Thread[] = JSON.parse(localStorage.getItem('threads') || '[]');
      console.log('Stored Threads:', storedThreads);
      const foundThread = storedThreads.find((t: Thread) => t.id === threadId);
      console.log('Found Thread:', foundThread);
      setThread(foundThread || null);
    }
  }, [threadId]);

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className='border p-4 rounded mx-20 mt-10'>
      <h3 className='flex justify-center font-semibold text-lg'>{thread.title}</h3>
          <p className='text-sm'>{thread.description}</p>
          <div className='flex justify-between text-slate-700 mt-4 text-xs'>
            <p >Category: {thread.category}</p>
            <p>Created: {new Date(thread.creationDate).toLocaleDateString()}</p>
            <p >Creator: {thread.creator.userName}</p>
          </div>
          
          <CommentSection threadId={thread.id} />
    </div>
  );
};

export default ThreadDetails;