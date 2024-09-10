// types.d.ts

// Clerk-användare använder strängbaserade ID:n
type ClerkUser = {
  id: string; // Clerk's ID är en sträng
  userName: string;
};

// Trådar använder Clerk-användare
type Thread = {
  id: number;
  title: string;
  category: ThreadCategory;
  creationDate: string;
  description: string;
  creator: ClerkUser; // Skaparen av tråden är en ClerkUser
  isLocked: boolean;
};

// QNA-tråd med extra fält
type QNAThread = Thread & {
  category: "QNA";
  isAnswered: boolean;
  commentAnswerId?: number;
};

// Diskussionstråd med extra fält
type DiscussionThread = Thread & {
  category: "DISCUSSION";
  discussionPoints: string[];
};

// Kommentarer i trådar
type ForumComment = {
  id: number;
  threadId: number;
  content: string;
  creator: ClerkUser; // Använd en återanvändbar typ för användaruppgifter
  creationDate: string;
  replies?: ForumComment[]; // Stöd för svar på kommentarer
};

// Typ för props till LockThread-komponenten
type LockThreadProps = {
  threadId: number;
  creatorId: string; // Använd sträng för ID eftersom det är ett ClerkUser ID
  isLocked: boolean;
  onLockToggle: (threadId: number, lockStatus: boolean) => void;
};

// Typ för props till EditThread-komponenten
type EditThreadProps = {
  threadId: number;
  creatorId: string;
  onThreadUpdate: (updatedThread: Thread) => void;
  onThreadDelete: (deletedThreadId: number) => void;
};


type AnswerButtonProps = {
  isAnswer: boolean; 
  canToggle: boolean; 
  category: string; 
  onToggle: () => void; // Callback för att toggla markeringen
};

// Lägg till denna typ i din types.d.ts-fil

type CommentOnCommentProps = {
  commentId: number;
  onAddReply: (commentId: number, reply: string) => void;
};

type CommentSectionProps = {
  threadId: number;
  creatorId: string; // Skaparen av tråden
  commentAnswerId?: number; // Vilken kommentar är markerad som svaret?
  onAnswerSelect: (commentId: number | null) => void; // Callback när ett svar väljs eller avmarkeras
  category: string; // Kategorin för tråden
};
