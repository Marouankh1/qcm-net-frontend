import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Edit, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useParams, useNavigate, useOutlet } from 'react-router';
import useQuizStore from '@/stores/quizStore';
import useQuestionStore from '@/stores/questionStore';
import { toast } from 'sonner';
import Header from '@/components/header';
import QuizDetails from './components/quiz-details';

export default function QuizDetailsPage() {
    const outlet = useOutlet();
    const { id: quizId } = useParams();
    const navigate = useNavigate();

    const { currentQuiz, fetchQuiz, isLoading: quizLoading } = useQuizStore();

    const {
        getQuestionsByQuiz,
        getChoicesByQuestion,
        fetchQuestionsByQuiz,
        fetchAllChoices,
        isLoading: questionLoading,
    } = useQuestionStore();

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingQuestions, setIsEditingQuestions] = useState(false);
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        difficulty: 'medium',
        duration: 30,
        category: 'protocols',
    });
    const [questions, setQuestions] = useState([]);
    const [originalQuizData, setOriginalQuizData] = useState(null);
    const [originalQuestions, setOriginalQuestions] = useState([]);

    // Load quiz data
    useEffect(() => {
        if (quizId) {
            loadQuizData();
        }
    }, [quizId]);

    const loadQuizData = async () => {
        try {
            await fetchQuiz(quizId);
            await fetchQuestionsByQuiz(quizId);
            await fetchAllChoices();

            // Update local state with quiz data
            if (currentQuiz) {
                const quizData = {
                    title: currentQuiz.title || '',
                    description: currentQuiz.description || '',
                    difficulty: currentQuiz.difficulty || 'medium',
                    duration: currentQuiz.duration || 30,
                    category: currentQuiz.category || 'protocols',
                };
                setQuizData(quizData);
                setOriginalQuizData(quizData);
            }

            // Update local state with questions
            const existingQuestions = getQuestionsByQuiz(parseInt(quizId));
            if (existingQuestions.length > 0) {
                const formattedQuestions = existingQuestions.map((q) => {
                    const choices = getChoicesByQuestion(q.id);
                    return {
                        id: q.id.toString(),
                        text: q.question_text,
                        points: q.points || 1,
                        answers: choices.map((c) => ({
                            id: c.id.toString(),
                            text: c.choice_text,
                            isCorrect: c.is_correct,
                        })),
                    };
                });
                setQuestions(formattedQuestions);
                setOriginalQuestions(JSON.parse(JSON.stringify(formattedQuestions)));
            }
        } catch (error) {
            toast.error('Failed to load quiz data');
        }
    };

    return (
        <div>
            {outlet || (
                <>
                    <Header title="Details Quiz" />
                    <QuizDetails />
                </>
            )}
        </div>
    );
}
