'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { GoogleIcon } from '@/shared/ui/google-icon';
import { TextField } from '@/shared/ui/text-field';

import { signInWithGoogle, sendMagicLink } from '../actions/auth';
import { magicLinkSchema, type MagicLinkInput } from '../schemas/auth-schema';

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isMagicLinkPending, startMagicLinkTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const oauthError = searchParams.get('error') === 'oauth_failed';

  const { control, handleSubmit } = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: '' },
  });

  function handleGoogleClick() {
    setFormError(null);
    startGoogleTransition(async () => {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error(error);
        setFormError('Something went wrong. Please try again.');
      }
    });
  }

  function onSubmit(values: MagicLinkInput) {
    setFormError(null);
    startMagicLinkTransition(async () => {
      const { error } = await sendMagicLink(values);
      if (error) {
        console.error(error);
        setFormError('Something went wrong. Please try again.');
        return;
      }
      router.push(
        `/auth/confirmation?email=${encodeURIComponent(values.email)}`,
      );
    });
  }

  const isPending = isGooglePending || isMagicLinkPending;

  return (
    <div className="flex flex-col gap-6 w-full max-w-xs ">
      <h1 className="text-center text-xl font-semibold">
        Welcome to Movie Rag
      </h1>

      {(oauthError || formError) && (
        <p role="alert" className="text-center text-sm text-destructive">
          {formError ?? 'Something went wrong. Please try again.'}
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isPending}
        onClick={handleGoogleClick}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground font-medium">OR</span>
        <Separator className="flex-1" />
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <TextField
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="example@mail.com"
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          Continue
        </Button>
      </form>
    </div>
  );
}
