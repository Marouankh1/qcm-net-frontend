import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useOutlet } from 'react-router';
import QuizzesList from '@/pages/teacher/quizzes/show/components/quizzes-list';
import Header from '@/components/header';

export default function ShowQuizzes() {
    const outlet = useOutlet();

    return (
        <div>
            {outlet || (
                <>
                    <Header title="Show Quizzes" />
                    <div className="p-6 mx-3 space-y-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Quiz Library</h2>
                                <p className="text-muted-foreground">Manage and view all your quizzes</p>
                            </div>
                            <Link to="/teacher/quizzes/create">
                                <Button className="gap-2 cursor-pointer">
                                    <Plus className="h-4 w-4" />
                                    Create Quiz
                                </Button>
                            </Link>
                        </div>
                        <QuizzesList />
                    </div>
                </>
            )}
        </div>
    );
}
