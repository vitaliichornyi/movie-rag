import { Sidebar } from '@/shared/ui/sidebar';
import { UserMenu } from '@/features/auth';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar footer={<UserMenu />} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
