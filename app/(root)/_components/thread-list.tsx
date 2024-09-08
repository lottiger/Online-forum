'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@clerk/nextjs'; // Import useUser hook from Clerk for user management
import LockThread from './lock-thread';

const ThreadList = (): JSX.Element => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const { user } = useUser(); // Use the useUser hook to access the logged-in user
  const router = useRouter();

  useEffect(() => {
    // Fetch threads from localStorage
    const storedThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    console.log('Stored Threads:', storedThreads);
    setThreads(storedThreads);
  }, []);

  const handleThreadClick = (id: number) => {
    router.push(`/${id}`);
  };

  const handleLockToggle = (threadId: number, lockStatus: boolean) => {
    // Update the thread's lock status in state and localStorage
    const updatedThreads = threads.map(thread =>
      thread.id === threadId ? { ...thread, isLocked: lockStatus } : thread
    );
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
  };

  return (
    <div className='flex flex-col w-full px-10'>
      {threads.map((thread) => {
        const creationDate = new Date(thread.creationDate);
        const isValidDate = !isNaN(creationDate.getTime());
        const isCreator = user && user.id === thread.creator.id;

        return (
          <section
            key={thread.id}
            className={`shadow-sm p-3 mb-4 rounded cursor-pointer transform transition-transform duration-200 hover:scale-105 ${!isCreator && thread.isLocked ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className='flex justify-center gap-2 items-center'>
              <h3 className='font-semibold text-lg'>{thread.title}</h3>
              {isCreator && (
                <LockThread
                  threadId={thread.id}
                  creatorId={thread.creator.id}
                  isLocked={thread.isLocked}
                  onLockToggle={handleLockToggle}
                />
              )}
            </div>
            <p className='text-sm' onClick={() => !thread.isLocked && handleThreadClick(thread.id)}>
              {thread.description}
            </p>
            <div className='flex justify-between text-slate-700 mt-4 text-xs'>
              <p>{thread.category}</p>
              <p>{isValidDate ? `${formatDistanceToNow(creationDate)} ago` : 'Invalid date'}</p>
              <p>By {thread.creator.userName}</p>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ThreadList;