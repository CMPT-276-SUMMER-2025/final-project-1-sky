"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export interface CityOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: CityOption[];
  loading: boolean;
  onInputChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({
  options,
  loading,
  onInputChange,
  placeholder = "",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<CityOption | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const isTyping = React.useRef(false);

  // Handle input changes with debouncing
  const handleInputChange = React.useCallback((value: string) => {
    isTyping.current = true;
    setInputValue(value);

    if (!open) setOpen(true);

    // Call parent callback
    onInputChange(value);

    // Reset typing flag after a short delay
    setTimeout(() => {
      isTyping.current = false;
    }, 100);
  }, [open, onInputChange]);

  // Handle selection
  const handleSelect = React.useCallback((option: CityOption) => {
    setSelected(option);
    setInputValue(option.label);
    setOpen(false);
    isTyping.current = false;
  }, []);

  // Handle open state changes
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    // Don't close if user is actively typing
    if (!isTyping.current) {
      setOpen(newOpen);
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          onClick={() => setOpen(true)}
        >
          {selected ? selected.label : "Select a city"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={handleInputChange}
            onFocus={() => setOpen(true)}
          />
          <CommandList>
            {loading && (
              <div className="p-2 text-sm text-muted-foreground">
                Loading...
              </div>
            )}
            {!loading && options.length === 0 && inputValue && (
              <CommandEmpty>No cities found.</CommandEmpty>
            )}
            {!loading &&
              options.length > 0 &&
              options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option)}
                  value={option.value}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected?.value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}