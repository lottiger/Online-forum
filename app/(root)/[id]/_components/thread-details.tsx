'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Thread {
  id: number;
  title: string;
  category: string;
  creationDate: string;
  description: string;
  creator: {
    userName: string;
    password: string;
  };
}

const ThreadDetails = (): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    if (id) {
      // Hämta tråden från localStorage
      const storedThreads = JSON.parse(localStorage.getItem('threads') || '[]');
      console.log('Stored Threads:', storedThreads);
      const foundThread = storedThreads.find((t: Thread) => t.id === parseInt(id as string, 10));
      console.log('Found Thread:', foundThread);
      setThread(foundThread);
    }
  }, [id]);

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{thread.title}</h2>
      <p><strong>Category:</strong> {thread.category}</p>
      <p><strong>Created on:</strong> {thread.creationDate}</p>
      <p><strong>Description:</strong> {thread.description}</p>
      <p><strong>Creator:</strong> {thread.creator.userName}</p>
    </div>
  );
};

export default ThreadDetails;