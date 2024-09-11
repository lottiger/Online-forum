import React, { useState, useEffect } from 'react';
import { CiEdit, CiTrash } from "react-icons/ci";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast'; // Importera toast hook

const EditThread = ({ threadId, creatorId, onThreadUpdate, onThreadDelete }: EditThreadProps): JSX.Element => {
  const [thread, setThread] = useState<Thread | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast(); // Använd toast hook

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
      toast({
        title: "Error",
        description: "Title and description cannot be empty.",
      });
      return;
    }

    if (thread) {
      const updatedThread = {
        ...thread,
        title: newTitle,
        description: newDescription,
      };

      const storedThreads: Thread[] = JSON.parse(localStorage.getItem('threads') || '[]');
      const updatedThreads = storedThreads.map((t) => (t.id === thread.id ? updatedThread : t));
      localStorage.setItem('threads', JSON.stringify(updatedThreads));

      onThreadUpdate(updatedThread);
      setIsOpen(false);
    }
  };

  const handleDeleteThread = () => {
    if (thread) {
      // Använd toast för att visa bekräftelse
      toast({
        title: "Delete thread?",
        description: "Are you sure you want to delete this thread?",
        action: (
          <Button
            variant="destructive"
            onClick={() => {
              const storedThreads: Thread[] = JSON.parse(localStorage.getItem('threads') || '[]');
              const updatedThreads = storedThreads.filter((t) => t.id !== thread.id);
              localStorage.setItem('threads', JSON.stringify(updatedThreads));

              onThreadDelete(thread.id);
              setIsOpen(false);

              toast({
                title: "Thread Deleted",
                description: "The thread has been successfully deleted.",
              });
            }}
          >
            Confirm
          </Button>
        ),
      });
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
          <div>
            <Label>Title</Label>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
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
