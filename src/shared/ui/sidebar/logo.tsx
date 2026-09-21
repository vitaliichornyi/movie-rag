import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center size-7 rounded-md text-md font-semibold bg-primary text-primary-foreground"
    >
      M
    </Link>
  );
}
