import {
  ToggleGroup as ToggleGroupPrimitive,
  ToggleGroupItem as ToggleGroupItemPrimitive,
} from '@/shared/ui/primitives/toggle-group';

interface ToggleGroupOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  options: ToggleGroupOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
}

export function ToggleGroup({
  options,
  value,
  onValueChange,
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      multiple
      value={value}
      onValueChange={(nextValue) => onValueChange([...nextValue])}
      className="flex-wrap"
    >
      {options.map((option) => (
        <ToggleGroupItemPrimitive
          key={option.value}
          value={option.value}
          variant="outline"
          className="rounded-full"
        >
          {option.label}
        </ToggleGroupItemPrimitive>
      ))}
    </ToggleGroupPrimitive>
  );
}
