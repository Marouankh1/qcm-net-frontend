import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function FormErrors({ errors, className }) {
    if (!errors || Object.keys(errors).length === 0) {
        return null;
    }

    return (
        <Alert
            variant="destructive"
            className={className}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to create your account</AlertTitle>
            <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-xs font-light">
                    {Object.entries(errors).map(
                        ([field, messages]) =>
                            Array.isArray(messages) &&
                            messages.map((message, index) => <li key={`${field}-${index}`}>{message}</li>)
                    )}
                </ul>
            </AlertDescription>
        </Alert>
    );
}
