'use client';

import React, { useEffect, useState } from 'react';


const ThreadDetails = ({ threadId }: { threadId: string | undefined }): JSX.Element => {
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    if (threadId) {
      // Hämta tråden från localStorage
      const storedThreads = JSON.parse(localStorage.getItem('threads') || '[]');
      console.log('Stored Threads:', storedThreads);
      const foundThread = storedThreads.find((t: Thread) => t.id === parseInt(threadId, 10));
      console.log('Found Thread:', foundThread);
      setThread(foundThread || null);
    }
  }, [threadId]);

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{thread.title}</h2>
      <p>Category: {thread.category}</p>
      <p>Created on: {thread.creationDate}</p>
      <p>Description: {thread.description}</p>
      <p>Creator: {thread.creator.userName}</p>
    </div>
  );
};

export default ThreadDetails;