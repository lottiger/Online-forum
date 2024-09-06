'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'; // För select-komponenten
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';



const CreateThread = (): JSX.Element => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast(); // Använd useToast
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ThreadCategory>("THREAD");
  const [error, setError] = useState({ title: "", description: "", auth: "" });

  const handleSubmit = () => {
    if (!user) {
      setError((prevError) => ({ ...prevError, auth: "You need to have an account to create a thread." }));
      toast({
        title: "Oops!",
        description: "You need to have an account to create a thread.",
      });
      return;
    }

    if (!title || !description) {
      setError((prevError) => ({
        ...prevError,
        title: !title ? "Title is required." : "",
        description: !description ? "Description is required." : "",
      }));
      if (!title) {
        toast({
          title: "Error",
          description: "Title is required.",
        });
      }
      if (!description) {
        toast({
          title: "Error",
          description: "Description is required.",
        });
      }
      return;
    }

    const newThread: Thread = {
      id: Date.now(),
      title,
      category,
      creationDate: new Date().toISOString(),
      description,
      creator: {
        id: parseInt(user.id, 10), // Konvertera user.id till nummer
        userName: user.username || user.primaryEmailAddress?.emailAddress || "",
        password: "", // Placeholder, använd inte lösenord i klartext
      },
      isLocked: false,
    };

    // Spara tråden i localStorage
    const threads = JSON.parse(localStorage.getItem('threads') || '[]');
    threads.push(newThread);
    localStorage.setItem('threads', JSON.stringify(threads));

    console.log('Thread created:', newThread);

    setTitle("");
    setDescription("");
    setCategory("QNA");

    router.push('/');
  };

  return (
    <div className='flex justify-center my-10'>
      <div className='flex flex-col w-full max-w-md p-4 rounded border'>
        <h1 className='text-2xl font-semibold mb-4'>Share something..</h1>
        
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='mb-2'
        />

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='mb-2'
        />

        <Select onValueChange={(value) => setCategory(value as ThreadCategory)} value={category}>
          <SelectTrigger className='mb-2'>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DISCUSSION">Discussion</SelectItem>
            <SelectItem value="QNA">Q&A</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit} className='w-full'>
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateThread;