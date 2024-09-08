type ThreadCategory = "THREAD" | "QNA" | "DISCUSSION";

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
  threadId: number; // Förtydligande av namngivning
  content: string;
  creator: ClerkUser; // Skaparen av kommentaren är en ClerkUser
  creationDate: string;
};

// Typ för props till LockThread-komponenten
type LockThreadProps = {
  threadId: number;
  creatorId: string; // Använd sträng för ID eftersom det är ett ClerkUser ID
  isLocked: boolean;
  onLockToggle: (threadId: number, lockStatus: boolean) => void;
};
