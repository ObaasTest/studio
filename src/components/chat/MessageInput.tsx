"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { SendHorizonal, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  chatId: string;
  currentUser: UserProfile;
  receiver: UserProfile;
}

export function MessageInput({ chatId, currentUser, receiver }: MessageInputProps) {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentUser) return;

    setIsSending(true);
    try {
      const messagesCollection = collection(db, 'chats', chatId, 'messages');
      const newMessage = {
        chatId,
        senderId: currentUser.uid,
        senderDisplayName: currentUser.displayName,
        senderPhotoURL: currentUser.photoURL,
        text: messageText.trim(),
        timestamp: serverTimestamp(),
      };
      await addDoc(messagesCollection, newMessage);

      // Update last message on chat document (optional, for chat list previews)
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, { 
        users: [currentUser.uid, receiver.uid].sort(), // Ensure users array is present
        lastMessage: {
          text: messageText.trim(),
          senderId: currentUser.uid,
          timestamp: serverTimestamp(), // Use serverTimestamp here as well
        }
      }, { merge: true });

      setMessageText('');
    } catch (error) {
      console.error("Error sending message: ", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="flex items-center space-x-2">
        {/* <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary">
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button> */}
        <Input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 focus-visible:ring-primary focus-visible:ring-offset-0"
          disabled={isSending}
        />
        <Button type="submit" size="icon" className="rounded-full bg-primary hover:bg-primary/90" disabled={isSending || !messageText.trim()}>
          {isSending ? <SendHorizonal className="h-5 w-5 animate-pulse" /> : <SendHorizonal className="h-5 w-5" />}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
