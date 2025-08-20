import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select"
import { SelectTrigger } from "./ui/select";
import { useFormField } from "./ui/form";

function SelectTriggerBorder({
    children,
    className,
    ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
    const { error } = useFormField();

    return (
        <SelectTrigger
            className={cn(className, error && "border-red-500 focus:border-red-500 focus:ring-red-500")}
            {...props}
        >
            {children}
        </SelectTrigger>
    );
}

export {
    SelectTriggerBorder
}