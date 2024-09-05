

type ThreadCategory = "THREAD" | "QNA" | "DISCUSSION";

type User = {
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
};