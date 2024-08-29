

type ThreadCategory = "THREAD" | "QNA";

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

type ForumComment = {
  id: number;
  thread: number;
  content: string;
  creator: User;
};