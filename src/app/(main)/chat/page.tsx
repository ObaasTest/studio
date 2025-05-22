"use client";

import { useState, useEffect } from 'react';
import { UserList } from '@/components/chat/UserList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageInput } from '@/components/chat/MessageInput';
import type { UserProfile } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquareText } from 'lucide-react';

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { user: currentUser } = useAuth(); // Current logged-in user
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && selectedUser) {
      const ids = [currentUser.uid, selectedUser.uid].sort();
      setChatId(`${ids[0]}_${ids[1]}`);
    } else {
      setChatId(null);
    }
  }, [currentUser, selectedUser]);

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] max-w-screen-2xl p-0 md:p-4">
      <div className="flex h-full rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <UserList
          currentUser={currentUser}
          onSelectUser={setSelectedUser}
          selectedUser={selectedUser}
        />
        <div className="flex flex-1 flex-col border-l">
          {selectedUser && currentUser && chatId ? (
            <>
              <ChatWindow 
                chatId={chatId} 
                currentUser={currentUser} 
                selectedUser={selectedUser} 
              />
              <MessageInput 
                chatId={chatId} 
                currentUser={currentUser} 
                receiver={selectedUser} 
              />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <MessageSquareText className="h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold text-foreground">Welcome to DbHands Chat!</h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                Select a user from the list on the left to start a conversation. Your messages will appear here in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
