export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-screen p-4 text-center">
      <h1 className="text-xl font-semibold">Check your email</h1>
      <p className="text-muted-foreground">
        We sent a sign-in link to{' '}
        {email ? <strong>{email}</strong> : 'your email'}.
      </p>
    </div>
  );
}
