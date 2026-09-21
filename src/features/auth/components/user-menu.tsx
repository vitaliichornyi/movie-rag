import { getUser } from '@/shared/lib/get-user';
import { signOut } from '../actions/auth';

import { Avatar } from '@/shared/ui/avatar';
import { DropdownMenu } from '@/shared/ui/dropdown-menu';

export async function UserMenu() {
  const { data: user, error } = await getUser();

  if (!user || error) {
    return null;
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const fallbackLabel = user.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <DropdownMenu
      side="right"
      align="end"
      menuLabel={user.email}
      items={[{ label: 'Log out', onClick: signOut }]}
    >
      <Avatar avatarUrl={avatarUrl} fallbackLabel={fallbackLabel} />
    </DropdownMenu>
  );
}
