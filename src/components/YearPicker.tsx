import { useState } from "react"

// ** UI imports
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ** Utils imports
import { cn } from "@/lib/utils"


interface YearPickerProps {
    value?: number
    onYearSelect?: (year: number) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    minYear?: number
    maxYear?: number
}

export default function YearPicker({
    value,
    onYearSelect,
    placeholder = "Seleccione el año",
    className,
    disabled = false,
    minYear = 1950,
    maxYear = 2100,
}: YearPickerProps) {
    const [open, setOpen] = useState(false)
    const [currentDecade, setCurrentDecade] = useState(
        value ? Math.floor(value / 10) * 10 : Math.floor(new Date().getFullYear() / 10) * 10,
    )

    const years = Array.from({ length: 12 }, (_, i) => currentDecade + i)

    const handleYearSelect = (year: number) => {
        if (year >= minYear && year <= maxYear) {
            onYearSelect?.(year)
            setOpen(false)
        }
    }

    const goToPreviousDecade = () => {
        setCurrentDecade((prev) => Math.max(prev - 10, Math.floor(minYear / 10) * 10))
    }

    const goToNextDecade = () => {
        setCurrentDecade((prev) => Math.min(prev + 10, Math.floor(maxYear / 10) * 10))
    }

    const isYearDisabled = (year: number) => {
        return year < minYear || year > maxYear
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("w-[200px] justify-start text-left font-normal", !value && "text-muted-foreground", className)}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value || placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={goToPreviousDecade}
                            disabled={currentDecade <= Math.floor(minYear / 10) * 10}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="font-semibold">
                            {currentDecade} - {currentDecade + 9}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={goToNextDecade}
                            disabled={currentDecade >= Math.floor(maxYear / 10) * 10}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {years.map((year) => (
                            <Button
                                key={year}
                                variant={value === year ? "default" : "ghost"}
                                className={cn("h-9 w-16 p-0 font-normal", isYearDisabled(year) && "text-muted-foreground opacity-50")}
                                onClick={() => handleYearSelect(year)}
                                disabled={isYearDisabled(year)}
                            >
                                {year}
                            </Button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
