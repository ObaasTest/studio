"use client";

import type { UserProfile } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface UserListProps {
  currentUser: UserProfile | null;
  onSelectUser: (user: UserProfile) => void;
  selectedUser: UserProfile | null;
}

export function UserList({ currentUser, onSelectUser, selectedUser }: UserListProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const usersCollection = collection(db, 'users');
    // Query all users except the current user
    const q = query(usersCollection, where('uid', '!=', currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="w-full md:w-72 lg:w-80 p-4 border-r flex flex-col">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="mr-2 h-6 w-6 text-primary" /> Contacts
        </h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-72 lg:w-80 p-4 border-r flex-col hidden md:flex">
       <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="mr-2 h-6 w-6 text-primary" /> Contacts
        </h2>
      <ScrollArea className="flex-1 pr-2">
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No other users found.</p>
        ) : (
          users.map(user => (
            <button
              key={user.uid}
              onClick={() => onSelectUser(user)}
              className={cn(
                "flex items-center w-full p-3 space-x-3 rounded-lg transition-colors hover:bg-muted",
                selectedUser?.uid === user.uid && "bg-accent text-accent-foreground hover:bg-accent/90"
              )}
              aria-current={selectedUser?.uid === user.uid ? "page" : undefined}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} data-ai-hint="profile avatar" />
                <AvatarFallback className={cn(selectedUser?.uid === user.uid ? "bg-accent-foreground text-accent" : "bg-primary text-primary-foreground")}>
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left overflow-hidden">
                <p className={cn("font-medium truncate", selectedUser?.uid === user.uid ? "text-accent-foreground" : "text-foreground")}>
                  {user.displayName}
                </p>
                <p className={cn("text-xs truncate", selectedUser?.uid === user.uid ? "text-accent-foreground/80" : "text-muted-foreground")}>
                  {user.email}
                </p>
              </div>
            </button>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
