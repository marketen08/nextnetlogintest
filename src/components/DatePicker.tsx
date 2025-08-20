import { useState } from "react";

// ** UI imports
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

// ** Utils imports
import { cn, formatDate } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useFormField } from "./ui/form";


const spanishWeekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const spanishMonths = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
    placeholder?: string;
}

function DatePicker({
    value,
    onChange,
    disabled = false,
    placeholder = "Elija la fecha",
}: DatePickerProps) {
    // ** Hooks
    const { error } = useFormField()
    // ** State
    const [calendarOpen, setCalendarOpen] = useState(false);

    return (
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                        "w-full pl-3 text-left font-normal",
                        !value && "text-muted-foreground",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                    )}
                >
                    {value ? (
                        formatDate(value) // Assuming formatDate is a utility function to format the date
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(val) => {
                        onChange(val);
                        setCalendarOpen(false);
                    }}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    formatters={{
                        formatWeekdayName: (date) => spanishWeekdays[date.getDay()],
                        formatCaption: (date) => {
                            return `${spanishMonths[date.getMonth()]} ${date.getFullYear()}`
                        }
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

function DateTimePicker({
    value,
    onChange,
    disabled = false,
    placeholder = "Elija la fecha",
}: DatePickerProps) {
    // ** State
    const [calendarOpen, setCalendarOpen] = useState(false);

    // ** Handlers
    function formatTime(date?: Date) {
        const pad = (n) => n.toString().padStart(2, '0');

        if (date) {
            return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
        }

        return ''

        //console.log(date?.toISOString().substring(11, 16))
    }

    return (
        <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-2">
                <Label className="px-1">
                    Fecha
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={true}>
                    <PopoverTrigger asChild>
                        <Button
                            disabled={disabled}
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !value && "text-muted-foreground"
                            )}
                        >
                            {value ? (
                                formatDate(value) // Assuming formatDate is a utility function to format the date
                            ) : (
                                <span>{placeholder}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={value}
                            onSelect={(val) => {
                                console.log(val?.toISOString())
                                if (value) {
                                    value.setMonth(val?.getMonth() || 0);
                                    value.setDate(val?.getDate() || 1);
                                    value.setFullYear(val?.getFullYear() || value.getFullYear());
                                    onChange(value);
                                } else {
                                    onChange(val);
                                }

                                setCalendarOpen(false);
                            }}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            formatters={{
                                formatWeekdayName: (date) => spanishWeekdays[date.getDay()],
                                formatCaption: (date) => {
                                    return `${spanishMonths[date.getMonth()]} ${date.getFullYear()}`
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="time-picker" className="px-1">
                    Hora
                </Label>
                <div className="relative">
                <Input
                    type="time"
                    id="time-picker"
                    step="60"
                    value={formatTime(value)}
                    onChange={(e) => {
                        const timeParts = e.target.value.split(':');
                        if (timeParts.length === 2) {
                            const hours = parseInt(timeParts[0], 10);
                            const minutes = parseInt(timeParts[1], 10);
                            if (value) {
                                value.setHours(hours);
                                value.setMinutes(minutes);
                                onChange(value);
                            }
                        }
                    }}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Clock className="ml-auto h-4 w-4 opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export {
    DatePicker,
    DateTimePicker
};