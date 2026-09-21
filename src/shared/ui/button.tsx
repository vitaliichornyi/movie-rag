import type { ComponentProps } from 'react';

import { Button as ButtonPrimitive } from '@/shared/ui/primitives/button';

type ButtonProps = ComponentProps<typeof ButtonPrimitive>;

export function Button(props: ButtonProps) {
  return <ButtonPrimitive {...props} />;
}
