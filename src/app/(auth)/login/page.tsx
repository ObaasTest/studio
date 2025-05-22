"use client";

import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/chat');
    } catch (error: any) {
      console.error("Login failed:", error);
      // The error message will be handled by AuthForm's internal state
      throw error;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <AuthForm
        formSchema={loginSchema}
        onSubmit={handleLogin}
        title="Welcome Back!"
        description="Log in to continue to DbHands."
        submitButtonText="Log In"
      />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Button variant="link" asChild className="text-primary hover:underline">
          <Link href="/signup">Sign up</Link>
        </Button>
      </p>
    </div>
  );
}
