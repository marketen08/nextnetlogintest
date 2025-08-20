import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
    * Decode JWT (JSON Web Token - <https://jwt.io/>) to object
    * @param {string} token
    * @returns {object}
    */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function validateCuit(cuit: string) {
    if (typeof cuit !== 'string') {
        return false;
    }

    cuit = cuit.replace(/-/g, '');

    if (cuit.length !== 11) {
        return false;
    }

    if (!/^\d+$/.test(cuit)) {
        return false;
    }

    const digits = cuit.split('').map(Number);
    const coefficients = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 10; i++) {
        sum += digits[i] * coefficients[i];
    }

    const verificationDigit = (11 - (sum % 11)) % 11;

    return verificationDigit === digits[10];
}

function addStateMethods<T extends { id: unknown }>(
    data: T[] | undefined,
    setState: (state: State<T>) => void,
    setDeleteId: (id?: T["id"]) => void
): ColumnCallback<T>[] {
    return (
        data?.map((item: T) => ({
            ...item,
            setState,
            setDeleteId,
        })) || []
    );
}

function formatDate(date: Date): string {
    const defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale ?? 'es-AR';
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    return new Intl.DateTimeFormat(defaultLocale, options).format(date);
}

function formatDateTime(date: Date): string {
    const defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale ?? 'es-AR';
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    return new Intl.DateTimeFormat(defaultLocale, options).format(date);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extendZodEffects<T extends z.ZodEffects<z.ZodObject<any>, any, any>>(schema: T, extension: z.ZodSchema) {
    // We can't use .extend() after .refine(), so this is a workaround
    // See https://github.com/colinhacks/zod/issues/454 for more details
    return schema.superRefine((value, ctx) => {
        const result = extension.safeParse(value)
        if (!result.success) {
            result.error.errors.forEach((issue) => ctx.addIssue(issue))
        }
        return result.success
    })
}

//function handleException<T extends FieldValues> (
//    setError: UseFormSetError<T>,
//    field: FieldPath<T> | undefined,
//    err: unknown,
//    defaultMessage: string) {
//    if (!setError) return;
//    let errMsg = defaultMessage;
//    if (err instanceof Error && err.message) {
//        errMsg = err.message as string;
//    }
//    setError(field as FieldPath<T> ?? 'server', { type: 'server', message: errMsg });
//}

// Generic State Type
type State<T> = {
    visible: boolean;
    data: T | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultState: State<any> = {
    visible: false,
    data: null
};

type ColumnCallback<T extends { id: unknown }> = T & {
    setState: (state: State<T>) => void;
    setDeleteId: (id?: T["id"]) => void;
}

enum Operation {
    Add = 'agregar',
    Update = 'actualizar',
    Delete = 'eliminar'
}

export {
    decodeJWT,
    validateCuit,
    addStateMethods,
    Operation,
    formatDate,
    formatDateTime,
    extendZodEffects,
    defaultState
    //handleException
}

export type {
    State,
    ColumnCallback
}
