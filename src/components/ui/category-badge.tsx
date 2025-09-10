import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAssignCategory } from "@/features/categories/api/assign-category";
import { useReplaceCategory } from "@/features/categories/api/replace-category";
import { Category } from "@/types/api";
import { cn } from "@/utils/utils";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { useUnassignCategory } from "@/features/categories/api/unassign-category";
import { useUIStore } from "../store/ui-store";

export const CategoryBadge = ({
    taskId,
    categories = [],
    taskCategory
}: {
    taskId: string,
    categories: Category[],
    taskCategory?: Category
}) => {
    const assignCategory = useAssignCategory();
    const replaceCategory = useReplaceCategory();
    const unassignCategory = useUnassignCategory();
    const comboboxStateKey = taskCategory?.id ? `category-combobox-${taskId}-${taskCategory.id}` : `category-combobox-${taskId}-new`;
    const isOpen = useUIStore((s) => s.isOpen(comboboxStateKey));
    const { open, close } = useUIStore();
    const [searchValue, setSearchValue] = useState("");
    const categoryExists = categories.some(
        (c) => c.title.toLowerCase() === searchValue.toLowerCase()
    );

    return (
        <Popover
            open={isOpen}
            onOpenChange={(openValue) => openValue ? open(comboboxStateKey) : close(comboboxStateKey)}
        >
            <PopoverTrigger asChild>
                <Badge className={cn(
                    "cursor-pointer",
                    !taskCategory && "h-5 min-w-5 rounded-full px-1"
                )}>
                    {taskCategory ? (
                        <>
                            {taskCategory.title}
                            <span className="text-xs" onClick={(e) => {
                                e.stopPropagation();
                                unassignCategory.mutate({
                                    taskId: taskId,
                                    categoryId: taskCategory.id
                                });
                            }}>
                                <XIcon strokeWidth={3} className="w-3 h-3" />
                            </span>
                        </>
                    ) : (
                        <PlusIcon />
                    )}
                </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search category..."
                        onValueChange={setSearchValue}
                    />
                    <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.id}
                                    onSelect={() => {
                                        if (taskCategory) {
                                            replaceCategory.mutate({
                                                taskId,
                                                data: { oldId: taskCategory.id, newId: category.id }
                                            })
                                        } else {
                                            assignCategory.mutate({
                                                taskId,
                                                data: { id: category.id }
                                            })
                                        }
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            category.id === taskCategory?.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {category.title}
                                </CommandItem>
                            ))}
                            {!categoryExists && searchValue.trim() && (
                                <CommandItem
                                    onSelect={() => {
                                        if (taskCategory) {
                                            replaceCategory.mutate({
                                                taskId,
                                                data: { oldId: taskCategory.id, title: searchValue }
                                            })
                                        } else {
                                            assignCategory.mutate({
                                                taskId: taskId,
                                                data: { title: searchValue }
                                            })
                                        }
                                    }}
                                >
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Add “{searchValue}”
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}