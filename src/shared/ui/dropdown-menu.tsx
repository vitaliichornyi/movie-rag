import type { ComponentProps, ReactNode } from 'react';

import {
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu';

interface DropdownMenuItemConfig {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  children: ReactNode;
  items: DropdownMenuItemConfig[];
  menuLabel?: string;
  side?: ComponentProps<typeof DropdownMenuContent>['side'];
  align?: ComponentProps<typeof DropdownMenuContent>['align'];
}

export function DropdownMenu({
  children,
  items,
  menuLabel,
  side,
  align,
}: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align}>
        <DropdownMenuGroup>
          {menuLabel && (
            <DropdownMenuLabel className="font-normal text-muted-foreground">
              {menuLabel}
            </DropdownMenuLabel>
          )}
          {menuLabel && <DropdownMenuSeparator />}
          {items.map((item) => (
            <DropdownMenuItem key={item.label} onClick={item.onClick}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuPrimitive>
  );
}
