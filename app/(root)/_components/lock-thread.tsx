'use client';

import React from 'react';
import { CiLock, CiUnlock } from 'react-icons/ci';
import { useUser } from '@clerk/nextjs'; 

const LockThread = ({ threadId, creatorId, isLocked, onLockToggle }: LockThreadProps): JSX.Element => {
  const { user } = useUser(); 

  const isModerator = user?.publicMetadata?.isModerator || false; // Kontrollera om användaren är moderator
  const isCreator = user?.id === creatorId; // Kontrollera om användaren är skaparen av tråden
  const canLockThread = isCreator || isModerator; // Antingen trådskaparen eller moderatorn kan toggla låsstatus

  const handleLockToggle = () => {
    if (canLockThread) {
      onLockToggle(threadId, !isLocked);
    }
  };

  return (
    <div className="flex justify-end">
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
