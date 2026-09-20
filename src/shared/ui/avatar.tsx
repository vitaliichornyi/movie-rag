import {
  Avatar as AvatarPrimitive,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar';

interface AvatarProps {
  avatarUrl?: string | null;
  fallbackLabel: string;
}

export function Avatar({ avatarUrl, fallbackLabel }: AvatarProps) {
  return (
    <AvatarPrimitive>
      {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
      <AvatarFallback>{fallbackLabel}</AvatarFallback>
    </AvatarPrimitive>
  );
}
