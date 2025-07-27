"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useRouter } from "next/navigation"

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

// List of Canadian cities for the combobox
const Cities = [
    "Toronto, Ontario",
    "Montreal, Quebec",
    "Calgary, Alberta",
    "Edmonton, Alberta",
    "Ottawa, Ontario",
    "Winnipeg, Manitoba",
    "Mississauga, Ontario",
    "Brampton, Ontario",
    "Vancouver, British Columbia",
    "Surrey, British Columbia",
    "Hamilton, Ontario",
    "Quebec City, Quebec",
    "Halifax, Nova Scotia",
    "London, Ontario",
    "Laval, Quebec",
    "Markham, Ontario",
    "Vaughan, Ontario",
    "Gatineau, Quebec",
    "Saskatoon, Saskatchewan",
    "Kitchener, Ontario",
];

const FormSchema = z.object({
    City: z.string().nonempty("City is required"),
})

export function ComboboxForm() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            City: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        // Navigate to info page with selected city as URL parameter
        router.push(`/info?city=${encodeURIComponent(data.City)}`)
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
                                <FormLabel></FormLabel>
                                <div className="h-4 flex items-start ml-2">
                                    <FormMessage className="text-red-500" />
                                </div>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className={cn(
                                                    "w-[320px] justify-between bg-white border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm",
                                                    !field.value && "text-slate-500"
                                                )}
                                            >
                                                {field.value
                                                    ? Cities.find((city) => city === field.value)
                                                    : "Select City"}
                                                <ChevronsUpDown className="opacity-50 text-slate-400" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent 
                                        className="w-[320px] p-0 bg-white border-slate-200 shadow-lg" 
                                        side="bottom" 
                                        align="start"
                                        avoidCollisions={false}
                                        sideOffset={4}
                                    >
                                        <Command className="bg-white">
                                            <CommandInput
                                                placeholder="Search cities..."
                                                className="h-9 border-0 focus:ring-0"
                                            />
                                            <CommandList className="max-h-48 overflow-y-auto">
                                                <CommandEmpty className="text-slate-500 text-center py-4">
                                                    Not a supported city
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {Cities.map((city) => (
                                                        <CommandItem
                                                            value={city}
                                                            key={city}
                                                            onSelect={() => {
                                                                form.setValue("City", city)
                                                                setOpen(false)
                                                            }}
                                                            className="hover:bg-blue-50 cursor-pointer"
                                                        >
                                                            {city}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto text-blue-600",
                                                                    city === field.value
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
                    <Button 
                        type="submit" 
                        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        View City Info
                    </Button>
                </div>
                <div className="flex justify-center">
                    <FormDescription className="text-slate-600">
                        This is the City that will be used in the dashboard.
                    </FormDescription>
                </div>
            </form>
        </Form>
    )
}