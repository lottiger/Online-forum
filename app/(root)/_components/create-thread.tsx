'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CreateThread = (): JSX.Element => {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ThreadCategory>("THREAD");
  const [error, setError] = useState({ title: "", description: "", auth: "" });

  const handleSubmit = () => {
    if (!user) {
      setError((prevError) => ({ ...prevError, auth: "You must be logged in to create a thread." }));
      return;
    }

    if (!title || !description) {
      setError((prevError) => ({
        ...prevError,
        title: !title ? "Title is required." : "",
        description: !description ? "Description is required." : "",
      }));
      return;
    }

    const newThread: Thread = {
      id: Date.now(),
      title,
      category,
      creationDate: new Date().toISOString(),
      description,
      creator: {
        userName: user.username || user.primaryEmailAddress?.emailAddress || "",
        password: "",
      },
    };

    // Spara tråden i localStorage
    const threads = JSON.parse(localStorage.getItem('threads') || '[]');
    threads.push(newThread);
    localStorage.setItem('threads', JSON.stringify(threads));

    console.log('Thread created:', newThread);

    setTitle("");
  setDescription("");
  setCategory("THREAD");
  
    router.push('/');
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='flex flex-col w-full max-w-md p-4 bg-white rounded shadow-md'>
        <h1 className='text-2xl font-bold mb-4'>Create Thread</h1>
        {error.auth && <p className='text-red-500'>{error.auth}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='mb-2 p-2 border rounded'
        />
        {error.title && <p className='text-red-500'>{error.title}</p>}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='mb-2 p-2 border rounded'
        />
        {error.description && <p className='text-red-500'>{error.description}</p>}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ThreadCategory)}
          className='mb-2 p-2 border rounded'
        >
          <option value="THREAD">Discussion</option>
          <option value="QNA">Q&A</option>
        </select>
        <button onClick={handleSubmit} className='p-2 bg-blue-500 text-white rounded'>
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateThread;