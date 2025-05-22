"use client";

import type { Message, UserProfile } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';

interface ChatWindowProps {
  chatId: string;
  currentUser: UserProfile;
  selectedUser: UserProfile;
}

export function ChatWindow({ chatId, currentUser, selectedUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;
    setLoading(true);
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive or chat changes
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatTimestamp = (timestamp: Timestamp | Date | undefined): string => {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return formatDistanceToNowStrict(date, { addSuffix: true });
  };


  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
             <AvatarImage src={selectedUser.photoURL ?? undefined} alt={selectedUser.displayName ?? 'User'} data-ai-hint="profile avatar" />
             <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(selectedUser.displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{selectedUser.displayName}</h2>
            <p className="text-xs text-muted-foreground">Active now</p> {/* Placeholder status */}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} viewportRef={viewportRef}>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn("flex items-end space-x-2", i % 2 === 0 ? "justify-start" : "justify-end")}>
                {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                <Skeleton className={cn("h-10 rounded-lg", i % 2 === 0 ? "w-48" : "w-40")} />
                {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">No messages yet.</p>
            <p className="text-sm text-muted-foreground">Be the first to send a message to {selectedUser.displayName}!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => {
              const isCurrentUserSender = msg.senderId === currentUser.uid;
              const sender = isCurrentUserSender ? currentUser : selectedUser;
              return (
                <div key={msg.id} className={cn("flex items-end space-x-2", isCurrentUserSender ? "justify-end" : "justify-start")}>
                  {!isCurrentUserSender && (
                    <Avatar className="h-8 w-8 self-end">
                      <AvatarImage src={sender.photoURL ?? undefined} alt={sender.displayName ?? 'User'} data-ai-hint="profile avatar" />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{getInitials(sender.displayName)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow",
                      isCurrentUserSender
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card text-card-foreground border rounded-bl-none"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    <p className={cn(
                        "text-xs mt-1",
                        isCurrentUserSender ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
                      )}>
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  </div>
                   {isCurrentUserSender && (
                    <Avatar className="h-8 w-8 self-end">
                      <AvatarImage src={sender.photoURL ?? undefined} alt={sender.displayName ?? 'User'} data-ai-hint="profile avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">{getInitials(sender.displayName)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
