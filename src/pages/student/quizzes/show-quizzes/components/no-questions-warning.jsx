import { Ban } from 'lucide-react';

export default function NoQuestionsWarning() {
    return (
        <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
                <Ban className="h-4 w-4" />
                <span className="text-sm">Some quizzes cannot be started because they have no questions.</span>
            </div>
        </div>
    );
}
