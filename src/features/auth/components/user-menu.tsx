import { getUser } from '@/shared/lib/get-user';
import { signOut } from '../actions/auth';

import { Avatar } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu';

export async function UserMenu() {
  const { data: user, error } = await getUser();

  if (!user || error) {
    return null;
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const fallbackLabel = user.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar avatarUrl={avatarUrl} fallbackLabel={fallbackLabel} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal text-muted-foreground">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
