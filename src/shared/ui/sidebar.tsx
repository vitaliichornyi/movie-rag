interface SidebarProps {
  footer: React.ReactNode;
}

export function Sidebar({ footer }: SidebarProps) {
  return (
    <aside className="flex flex-col items-center justify-between shrink-0 h-full w-12 border-r border-border bg-sidebar py-2">
      <div className="flex items-center justify-center size-7 rounded-md text-md font-semibold bg-primary text-primary-foreground">
        M
      </div>
      {footer}
    </aside>
  );
}
