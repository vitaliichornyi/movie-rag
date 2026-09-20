'use client';

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { Field, FieldLabel, FieldError } from '@/shared/ui/primitives/field';
import {
  InputGroup,
  InputGroupInput,
} from '@/shared/ui/primitives/input-group';

interface TextFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
}

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
}: TextFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={name}
              type={type}
              placeholder={placeholder}
              aria-invalid={!!fieldState.error}
              {...field}
            />
          </InputGroup>
          <FieldError
            errors={fieldState.error ? [fieldState.error] : undefined}
          />
        </Field>
      )}
    />
  );
}
