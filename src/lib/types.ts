import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null; // Optional for now
}

export interface Message {
  id: string; // Firestore document ID
  chatId: string;
  senderId: string;
  senderDisplayName: string | null;
  senderPhotoURL?: string | null;
  text: string;
  timestamp: Timestamp; // Firestore Timestamp
}
