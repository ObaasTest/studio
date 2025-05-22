"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading, firebaseUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  // const [photoURL, setPhotoURL] = useState(''); // For future photo upload
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      // setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        // photoURL: photoURL, // For future photo upload
      });

      // Optionally update Firebase Auth profile if direct changes are allowed/needed
      // This is more complex and might require re-authentication for email/password changes
      // For displayName and photoURL with Firebase Auth, it's:
      // import { updateProfile } from "firebase/auth";
      // if (firebaseUser) {
      //   await updateProfile(firebaseUser, { displayName, photoURL });
      // }
      // For now, we only update Firestore. AuthProvider will re-fetch on next auth state change.

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-4 border-primary shadow-md">
            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} data-ai-hint="profile large_avatar" />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-primary">{user.displayName}</CardTitle>
          <CardDescription>Manage your account settings and profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-base"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="text-base bg-muted/50 cursor-not-allowed"
              />
            </div>
            {/* Future photo URL input
            <div className="space-y-2">
              <Label htmlFor="photoURL">Photo URL</Label>
              <Input
                id="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>
            */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
            <p>Changes to your display name will be reflected across the application.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
