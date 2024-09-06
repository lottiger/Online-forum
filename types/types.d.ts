

type ThreadCategory = "THREAD" | "QNA" | "DISCUSSION";

type User = {
 id: number;
  userName: string;
  password: string;
};

type Thread = {
  id: number;
  title: string;
  category: string;
  creationDate: string;
  description: string;
  creator: User;
  isLocked: boolean;
};

type QNAThread = Thread & { //Type extension
  category: "QNA";
  isAnswered: boolean;
  commentAnswerId?: number;
};

type DiscussionThread = Thread & { //Type extension
  category: "DISCUSSION";
  discussionPoints: string[];
};

type ForumComment = {
  id: number;
  thread: number;
  content: string;
  creator: User;
  creationDate: string;
};

type LockThreadProps = {
  threadId: number;
  creatorId: number;
  isLocked: boolean;
  currentUserId: number | null;
  onLockToggle: (threadId: number, lockStatus: boolean) => void;
};


