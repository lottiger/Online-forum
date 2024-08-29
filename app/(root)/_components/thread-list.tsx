'use client'

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
    // Hämta trådarna från localStorage
    const storedThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    setThreads(storedThreads);
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-4'>Thread List</h1>
      {threads.length === 0 ? (
        <p>No threads available.</p>
      ) : (
        <ul className='w-full max-w-md'>
          {threads.map((thread) => (
            <li key={thread.id} className='mb-4 p-4 border rounded shadow'>
              <h2 className='text-xl font-bold'>{thread.title}</h2>
              <p className='text-gray-600'>{thread.category}</p>
              <p className='text-gray-600'>{new Date(thread.creationDate).toLocaleString()}</p>
              <p>{thread.description}</p>
              <p className='text-gray-600'>Created by: {thread.creator.userName}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThreadList;