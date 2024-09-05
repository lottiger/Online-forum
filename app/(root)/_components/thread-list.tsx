'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

const ThreadList = (): JSX.Element => {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    // Hämta trådar från localStorage
    const storedThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    console.log('Stored Threads:', storedThreads);
    setThreads(storedThreads);
  }, []);

  return (
    <ul>
      {threads.map((thread) => (
        <li key={thread.id}>
          <h3>{thread.title}</h3>
          <p className='text-gray-600'>{new Date(thread.creationDate).toLocaleString()}</p>
          <p>{thread.description}</p>
          {thread.creator ? (
            <p className='text-gray-600'>Created by: {thread.creator.userName}</p>
          ) : (
            <p className='text-gray-600'>Creator information is missing</p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ThreadList;