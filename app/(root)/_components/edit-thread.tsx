import React, { useState, useEffect } from 'react';
import { CiEdit, CiTrash } from "react-icons/ci";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EditThreadProps {
  threadId: number;
  creatorId: string;
  onThreadUpdate: (updatedThread: Thread) => void;
  onThreadDelete: (deletedThreadId: number) => void; // Ny prop för att hantera radering
}

const EditThread = ({ threadId, creatorId, onThreadUpdate, onThreadDelete }: EditThreadProps): JSX.Element => {
  const [thread, setThread] = useState<Thread | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Hämta tråden från localStorage
    const storedThreads: Thread[] = JSON.parse(localStorage.getItem('threads') || '[]');
    const foundThread = storedThreads.find((t) => t.id === threadId);

    if (foundThread) {
      setThread(foundThread);
      setNewTitle(foundThread.title);
      setNewDescription(foundThread.description);
    }
  }, [threadId]);

  const handleUpdateThread = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Title and description cannot be empty."); // Replace with a toast if desired
      return;
    }

    if (thread) {
      // Uppdatera tråden med nya värden
      const updatedThread = {
        ...thread,
        title: newTitle,
        description: newDescription,
      };

      // Uppdatera tråden i localStorage
      const storedThreads: Thread[] = JSON.parse(localStorage.getItem('threads') || '[]');
      const updatedThreads = storedThreads.map((t) => (t.id === thread.id ? updatedThread : t));
      localStorage.setItem('threads', JSON.stringify(updatedThreads));

      // Skicka tillbaka ändringen till föräldrakomponenten
      onThreadUpdate(updatedThread);

      // Stäng dialogen efter att ändringar har sparats
      setIsOpen(false);
    }
  };

  // Hantera borttagning av tråd
  const handleDeleteThread = () => {
    if (thread) {
      const confirmDelete = window.confirm('Are you sure you want to delete this thread?');
      if (confirmDelete) {
        // Ta bort tråden från localStorage
        const storedThreads: Thread[] = JSON.parse(localStorage.getItem('threads') || '[]');
        const updatedThreads = storedThreads.filter((t) => t.id !== thread.id);
        localStorage.setItem('threads', JSON.stringify(updatedThreads));

        // Skicka tillbaka raderingsinformationen till föräldrakomponenten
        onThreadDelete(thread.id);

        // Stäng dialogen
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button>
          <CiEdit style={{ fontSize: '1.5rem' }} />
        </button>
      </DialogTrigger>
      <DialogContent className='bg-slate-50 dark:bg-slate-950'>
        <DialogHeader>
          <DialogTitle>Edit Thread</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className=''>
            <Label className=''>Title</Label>
            {/* <label className="block text-sm font-medium">Title</label> */}
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          </div>
          <div>
            <Label className="">Description</Label>
            <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
          </div>
          <div className="flex justify-between items-center">
            <Button onClick={handleUpdateThread}>Save Changes</Button>
            <Button variant="destructive" onClick={handleDeleteThread}>
              <CiTrash className="mr-2" /> Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditThread;
