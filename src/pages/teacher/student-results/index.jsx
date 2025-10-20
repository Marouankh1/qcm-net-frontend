// pages/teacher/student-results/index.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, BarChart3, RefreshCw } from 'lucide-react';
import useStudentResultsStore from '@/stores/studentResultsStore';
import useQuizStore from '@/stores/quizStore';
import { toast } from 'sonner';

function StudentResultsPage() {
    const { students, studentsLoading, studentsError, fetchStudentsStats, clearErrors } = useStudentResultsStore();

    const { quizzes, fetchQuizzes } = useQuizStore();

    const [searchInput, setSearchInput] = useState('');
    const [selectedQuiz, setSelectedQuiz] = useState('all');

    // Charger les données au montage du composant
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            clearErrors();
            await fetchQuizzes();
            await fetchStudentsStats(); // Charger les étudiants sans filtres
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleSearch = async () => {
        try {
            const searchParams = {};

            if (searchInput.trim()) {
                searchParams.search = searchInput.trim();
            }

            if (selectedQuiz && selectedQuiz !== 'all') {
                searchParams.quiz_id = selectedQuiz;
            }

            await fetchStudentsStats(searchParams);
        } catch (error) {
            toast.error('Failed to search students');
        }
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setSelectedQuiz('all');
        fetchStudentsStats({}); // Charger tous les étudiants
    };

    const handleRefresh = () => {
        loadInitialData();
    };

    const handleQuizChange = (value) => {
        setSelectedQuiz(value);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Results</h1>
                    <p className="text-muted-foreground">Monitor student performance and results</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        className={'cursor-pointer'}
                        onClick={handleRefresh}
                        variant="outline"
                        size="icon"
                        disabled={studentsLoading}>
                        <RefreshCw className={`h-4 w-4 ${studentsLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Search Students</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-9"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    disabled={studentsLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Filter by Quiz</label>
                            <Select
                                value={selectedQuiz}
                                onValueChange={handleQuizChange}
                                disabled={studentsLoading}>
                                <SelectTrigger className="w-full md:w-[200px] cursor-pointer">
                                    <SelectValue placeholder="All quizzes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        className={'cursor-pointer'}
                                        value="all">
                                        All quizzes
                                    </SelectItem>
                                    {quizzes.map((quiz) => (
                                        <SelectItem
                                            className={'cursor-pointer'}
                                            key={quiz.id}
                                            value={quiz.id.toString()}>
                                            {quiz.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                className={'cursor-pointer'}
                                onClick={handleSearch}
                                disabled={studentsLoading}>
                                <Search className="h-4 w-4 mr-2" />
                                {studentsLoading ? 'Searching...' : 'Search'}
                            </Button>
                            <Button
                                className={'cursor-pointer'}
                                variant="outline"
                                onClick={handleClearFilters}
                                disabled={studentsLoading}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content */}
            {studentsError && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="text-red-800">
                            <p className="font-medium">Error loading students</p>
                            <p className="text-sm mt-1">{studentsError}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {studentsLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <div className="flex gap-4">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : students.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No students found</h3>
                        <p className="text-muted-foreground mt-2">
                            {searchInput || selectedQuiz !== 'all'
                                ? 'No students match your search criteria.'
                                : 'No students have attempted your quizzes yet.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        Found {students.length} student{students.length !== 1 ? 's' : ''}
                    </div>

                    {students.map((student) => (
                        <Card
                            key={student.id}
                            className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg">
                                                {student.first_name} {student.last_name}
                                            </h3>
                                            <Badge variant="outline">{student.quizzes_attempted || 0} quizzes</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-3">{student.email}</p>

                                        {/* Recent quizzes */}
                                        <div className="space-y-1">
                                            {student.student_results?.slice(0, 2).map((result, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">{result.quiz?.title}:</span>
                                                    <Badge
                                                        className={
                                                            result.final_score >= 80
                                                                ? 'bg-green-100 text-green-800'
                                                                : result.final_score >= 60
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }>
                                                        {result.final_score}%
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {result.completed_at
                                                            ? new Date(result.completed_at).toLocaleDateString()
                                                            : 'Not completed'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {/* Average Score */}
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 mb-1">
                                                <span
                                                    className={`text-2xl font-bold ${
                                                        student.average_score >= 80
                                                            ? 'text-green-600'
                                                            : student.average_score >= 60
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600'
                                                    }`}>
                                                    {student.average_score ? Math.round(student.average_score) : 0}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Average</p>
                                        </div>

                                        {/* View Details Button */}
                                        <Button
                                            className={'cursor-pointer'}
                                            onClick={() => (window.location.href = `/teacher/student-results/${student.id}`)}
                                            variant="outline"
                                            size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentResultsPage;
