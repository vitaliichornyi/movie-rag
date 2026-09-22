import type { ComponentProps, ReactNode } from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/ui/primitives/input-group';

type TextInputProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  'prefix'
> & {
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export function TextInput({ prefix, suffix, ...props }: TextInputProps) {
  return (
    <InputGroup>
      {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
      <InputGroupInput {...props} />
      {suffix && (
        <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon>
      )}
    </InputGroup>
  );
}
