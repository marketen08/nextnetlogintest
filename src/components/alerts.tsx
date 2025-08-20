// ** UI Imports
import { XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AlertErrorProps {
    error?: string;
}

function AlertError({ error }: AlertErrorProps) {
    if (!error) {
        return null;
    }

  
    return (
        <Alert className="bg-red-50 border-red-200 flex items-center gap-2" >
            <div>
                <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
    );
}

export {
    AlertError
};