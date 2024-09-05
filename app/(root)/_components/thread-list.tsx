'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const ThreadList = (): JSX.Element => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Hämta trådar från localStorage
    const storedThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    console.log('Stored Threads:', storedThreads);
    setThreads(storedThreads);
  }, []);

  const handleThreadClick = (id: number) => {
    router.push(`/${id}`);
  };

  return (
    <div className='flex flex-col w-full px-10'>
      {threads.map((thread) => (
        <section
          key={thread.id}
          className='shadow-sm p-3 mb-4 rounded cursor-pointer transform transition-transform duration-200 hover:scale-105'
          onClick={() => handleThreadClick(thread.id)}
        >
          <h3 className='flex justify-center font-semibold text-lg'>{thread.title}</h3>
          <p className='text-sm'>{thread.description}</p>
          <div className='flex justify-between text-slate-700 mt-4'>
            <p className='text-xs'>Category: {thread.category}</p>
            <p className='text-xs'>Created on: {thread.creationDate}</p>
            <p className='text-xs'>Creator: {thread.creator.userName}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ThreadList;