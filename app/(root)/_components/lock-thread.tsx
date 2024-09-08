'use client';

import React from 'react';
import { CiLock, CiUnlock } from 'react-icons/ci';
import { useUser } from '@clerk/nextjs'; // To get the logged-in user (if any)


const LockThread: React.FC<LockThreadProps> = ({ threadId, creatorId, isLocked, onLockToggle }) => {
  const { user } = useUser(); // Get the logged-in user from Clerk

  const handleLockToggle = () => {
    if (user?.id === creatorId) { // Direct comparison without converting to string
      // Only the creator of the thread can toggle the lock status
      onLockToggle(threadId, !isLocked);
    }
  };

  // Check if the logged-in user is the thread creator
  const canLockThread = user?.id === creatorId;

  return (
    <div className='flex justify-end'>
      {canLockThread ? (
        <button onClick={handleLockToggle} aria-label={isLocked ? 'Unlock Thread' : 'Lock Thread'} className="hover:opacity-75 transition-opacity duration-300">
          {isLocked ? <CiLock className="text-2xl text-red-500" /> : <CiUnlock className="text-2xl text-green-500" />}
        </button>
      ) : (
        <span>
          {isLocked ? <CiLock className="text-2xl text-gray-400" /> : <CiUnlock className="text-2xl text-gray-400" />}
        </span>
      )}
    </div>
  );
};

export default LockThread;
