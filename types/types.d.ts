

// ----------------- Clerk & User Types -----------------
type ClerkUser = {
  id: string; // Clerk's ID är en sträng
  userName: string;
  isModerator: boolean;
};

// ----------------- Thread Types -----------------
type ThreadCategory = "THREAD" | "QNA" | "DISCUSSION";

type Thread = {
  id: number;
  title: string;
  category: ThreadCategory;
  creationDate: string;
  description: string;
  creator: ClerkUser; // Skaparen av tråden är en ClerkUser
  isLocked: boolean;
};

// QNA-thread med extra fält
type QNAThread = Thread & {
  category: "QNA";
  isAnswered: boolean;
  commentAnswerId?: number;
};

// Discussion-thread med extra fält
type DiscussionThread = Thread & {
  category: "DISCUSSION";
  discussionPoints: string[]; //diskussioner runt flera ämnen inom samma tråd
};

// ----------------- Comment Types -----------------
type ForumComment = {
  id: number;
  threadId: number;
  content: string;
  creator: ClerkUser; // Använd en återanvändbar typ för användaruppgifter
  creationDate: string;
  replies?: ForumComment[]; // Stöd för svar på kommentarer
};

// ----------------- Component Props -----------------

// LockThread props
type LockThreadProps = {
  threadId: number;
  creatorId: string; // Använd sträng för ID eftersom det är ett ClerkUser ID
  isLocked: boolean;
  onLockToggle: (threadId: number, lockStatus: boolean) => void;
};

// EditThread props
type EditThreadProps = {
  threadId: number;
  creatorId: string;
  onThreadUpdate: (updatedThread: Thread) => void;
  onThreadDelete: (deletedThreadId: number) => void;
};

// AnswerButton props
type AnswerButtonProps = {
  isAnswer: boolean; 
  canToggle: boolean; 
  category: string; 
  onToggle: () => void; // Callback för att toggla markeringen
};

// CommentOnComment props
type CommentOnCommentProps = {
  commentId: number;
  onAddReply: (commentId: number, reply: string) => void;
};

// CommentSection props
type CommentSectionProps = {
  threadId: number;
  creatorId: string; // Skaparen av tråden
  commentAnswerId?: number; // Vilken kommentar är markerad som svaret?
  onAnswerSelect: (commentId: number | null) => void; // Callback när ett svar väljs eller avmarkeras
  category: string; // Kategorin för tråden
};
