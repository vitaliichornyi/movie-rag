import { Logo } from '@/shared/ui/sidebar/logo';

interface SidebarProps {
  footer: React.ReactNode;
}

export function Sidebar({ footer }: SidebarProps) {
  return (
    <aside className="flex flex-col items-center justify-between shrink-0 h-full w-12 border-r border-border bg-sidebar py-2">
      <Logo />
      {footer}
    </aside>
  );
}
