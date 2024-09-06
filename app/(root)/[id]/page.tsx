'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import ThreadDetails from './_components/thread-details';

function DetailsPage() {
  const params = useParams();
  let { id } = params;

  if (Array.isArray(id)) {
    id = id[0];
  }

  const threadId = id ? parseInt(id, 10) : undefined;

  return (
    <div>
    <div>
      {/* <h1>Inlägg {threadId}</h1> */}
      <ThreadDetails threadId={threadId} />

    </div>
    <div>
    
    </div>
    </div>
  );
}

export default DetailsPage;