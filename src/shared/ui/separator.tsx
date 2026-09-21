import type { ComponentProps } from 'react';

import { Separator as SeparatorPrimitive } from '@/shared/ui/primitives/separator';

type SeparatorProps = ComponentProps<typeof SeparatorPrimitive>;

export function Separator(props: SeparatorProps) {
  return <SeparatorPrimitive {...props} />;
}
