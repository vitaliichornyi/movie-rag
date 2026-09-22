'use client';

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { Field, FieldLabel, FieldError } from '@/shared/ui/primitives/field';
import { TextInput } from '@/shared/ui/text-input';

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
          <TextInput
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={!!fieldState.error}
            {...field}
          />
          <FieldError
            errors={fieldState.error ? [fieldState.error] : undefined}
          />
        </Field>
      )}
    />
  );
}
