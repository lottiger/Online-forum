import { useUser } from '@clerk/clerk-react';
import React from 'react';

const Moderator: React.FC = () => {
  const { user } = useUser();

  if (!user) return <div>Loading...</div>;

 
  const isModerator = user.publicMetadata?.isModerator || false;

  return (
    <div>
      {isModerator ? (
        <div>Moderator</div>
      ) : (
        <div>You are not a moderator.</div>
      )}
    </div>
  );
};

export default Moderator;
