"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const Cities = [
  { label: "Placeholder City1", value: "City1" },
  { label: "Placehholder City2", value: "City2" },
  { label: "Placehholder City3", value: "City3" },
  { label: "Placehholder City4", value: "City4" },
  { label: "Placehholder City5", value: "City5" },
  { label: "Placehholder City6", value: "City6" },
  { label: "Placehholder City7", value: "City7" },
  { label: "Placehholder City8", value: "City8" },
  { label: "Placehholder City9", value: "City9" },
] as const

const FormSchema = z.object({
  City: z.string().nonempty("City is required"),
})

export function ComboboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      City: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name="City"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>City</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? Cities.find(
                            (City) => City.value === field.value
                          )?.label
                        : "Select City"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search cities..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {Cities.map((City) => (
                          <CommandItem
                            value={City.label}
                            key={City.value}
                            onSelect={() => {
                              form.setValue("City", City.value)
                            }}
                          >
                            {City.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                City.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-5">Submit</Button>
        </div>
        <FormDescription>
          This is the City that will be used in the dashboard.
        </FormDescription>
        <FormMessage />
      </form>
    </Form>
  )
}
