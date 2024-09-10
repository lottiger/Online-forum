'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@clerk/nextjs'; // Använd Clerk för användarhantering
import LockThread from './lock-thread';
import EditThread from './edit-thread';

const ThreadList = (): JSX.Element => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const { user } = useUser(); // Använd Clerk's useUser hook för att få tillgång till den inloggade användaren
  const router = useRouter();

  useEffect(() => {
    // Hämta trådar från localStorage
    const storedThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    setThreads(storedThreads);
  }, []);

  const handleThreadClick = (id: number) => {
    router.push(`/${id}`);
  };

  // Hantera uppdatering av tråd när trådskaparen redigerar
  const handleThreadUpdate = (updatedThread: Thread) => {
    const updatedThreads = threads.map((thread) =>
      thread.id === updatedThread.id ? updatedThread : thread
    );
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
  };

  // Hantera borttagning av tråd
  const handleThreadDelete = (deletedThreadId: number) => {
    const updatedThreads = threads.filter((thread) => thread.id !== deletedThreadId);
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
  };

  const handleLockToggle = (threadId: number, lockStatus: boolean) => {
    // Uppdatera trådens låsstatus i state och localStorage
    const updatedThreads = threads.map(thread =>
      thread.id === threadId ? { ...thread, isLocked: lockStatus } : thread
    );
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
  };

  const isModerator = user?.publicMetadata?.isModerator || false; // Kolla om användaren är en moderator

  return (
    <div className='flex flex-col w-full px-10'>
      {threads.map((thread) => {
        const creationDate = new Date(thread.creationDate);
        const isValidDate = !isNaN(creationDate.getTime());
        const isCreator = user && user.id === thread.creator.id; // Kolla om användaren är trådskaparen

        return (
          <section
            key={thread.id}
            className={`shadow-sm p-3 mb-4 rounded cursor-pointer transform transition-transform duration-200 hover:scale-105 ${!isCreator && !isModerator && thread.isLocked ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className='flex justify-between'>
              <div>
                <h3 className='font-semibold text-lg'>{thread.title}</h3>
              </div>
              <div className='flex gap-1'>
                {/* Moderators eller trådskaparen kan hantera tråden */}
                {(isCreator || isModerator) && (
                  <>
                    {/* Lås/öppna tråden */}
                    <LockThread
                      threadId={thread.id}
                      creatorId={thread.creator.id}
                      isLocked={thread.isLocked}
                      onLockToggle={handleLockToggle}
                    />
                    {/* Redigera/radera tråden */}
                    <EditThread
                      threadId={thread.id}
                      creatorId={thread.creator.id}
                      onThreadUpdate={handleThreadUpdate}
                      onThreadDelete={handleThreadDelete}
                    />
                  </>
                )}
              </div>
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
