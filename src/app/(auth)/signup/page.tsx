"use client";

import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const signUpSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (values: SignUpFormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: values.displayName,
        photoURL: user.photoURL,
      };
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      router.push('/chat');
    } catch (error: any) {
      console.error("Sign up failed:", error);
      // The error message will be handled by AuthForm's internal state
      throw error;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <AuthForm
        formSchema={signUpSchema}
        onSubmit={handleSignUp}
        isSignUp={true}
        title="Create an Account"
        description="Join DbHands to start messaging."
        submitButtonText="Sign Up"
      />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Button variant="link" asChild className="text-primary hover:underline">
          <Link href="/login">Log in</Link>
        </Button>
      </p>
    </div>
  );
}
