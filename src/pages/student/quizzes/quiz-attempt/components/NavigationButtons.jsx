import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const NavigationButtons = ({ isFirst, isLast, isSubmitting, onPrevious, onNext, onSubmit }) => (
    <div className="flex justify-between items-center">
        <Button
            className={'cursor-pointer'}
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}>
            Previous Question
        </Button>

        <div className="flex items-center gap-2">
            {!isLast ? (
                <Button onClick={onNext}>Next Question</Button>
            ) : (
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 cursor-pointer">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
            )}
        </div>
    </div>
);

export default NavigationButtons;
