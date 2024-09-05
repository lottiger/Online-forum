'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import ThreadDetails from './_components/thread-details';


function DetailsPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <h1>Inlägg {id}</h1>
      <ThreadDetails threadId={id} />
    </>
  );
}

export default DetailsPage;