import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ConfirmDialogProps {
    visible: boolean;
    close: (ok: boolean) => void;
    title: string;
    okButtonText?: string;
    cancelButtonText?: string;
}

function ConfirmDialog({ visible, close, title, okButtonText = 'Ok', cancelButtonText = 'Cancelar' }: ConfirmDialogProps) {
    return (
        <Dialog open={visible} onOpenChange={() => close(false)}>
            <DialogContent className="max-w-4/5 sm:max-w-[425px]"
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    document.body.style.pointerEvents = '';
                }}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{title}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogFooter className="grid grid-cols-2 md:grid-cols-3">
                    <Button onClick={() => close(true)} variant="destructive" className="md:col-start-2">{okButtonText}</Button>
                    <Button onClick={() => close(false)}>{cancelButtonText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>)
}

export {
    ConfirmDialog
}