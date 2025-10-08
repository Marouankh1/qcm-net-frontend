'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Clock, Users, BarChart3, Edit, Trash2, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Link, useNavigate, useOutlet } from 'react-router';
import useAuthStore from '@/stores/authStore';
import { useLogout } from '@/hooks/react-query/auth/useAuth';

const quizzes = [
    {
        id: 1,
        title: 'Network Protocols Fundamentals',
        description: 'Test your knowledge of TCP/IP, HTTP, and other essential protocols',
        questions: 20,
        duration: 30,
        difficulty: 'Medium',
        participants: 45,
        avgScore: 78,
        createdAt: '2 days ago',
        status: 'Active',
    },
    {
        id: 2,
        title: 'OSI Model Deep Dive',
        description: 'Comprehensive quiz covering all 7 layers of the OSI model',
        questions: 15,
        duration: 25,
        difficulty: 'Hard',
        participants: 32,
        avgScore: 65,
        createdAt: '5 days ago',
        status: 'Active',
    },
    {
        id: 3,
        title: 'Subnetting Basics',
        description: 'Master IP addressing and subnet calculations',
        questions: 25,
        duration: 40,
        difficulty: 'Easy',
        participants: 67,
        avgScore: 82,
        createdAt: '1 week ago',
        status: 'Active',
    },
    {
        id: 4,
        title: 'Network Security Essentials',
        description: 'Learn about firewalls, encryption, and security protocols',
        questions: 18,
        duration: 35,
        difficulty: 'Medium',
        participants: 28,
        avgScore: 71,
        createdAt: '1 week ago',
        status: 'Draft',
    },
    {
        id: 5,
        title: 'Routing and Switching',
        description: 'Understanding routers, switches, and network topology',
        questions: 22,
        duration: 45,
        difficulty: 'Hard',
        participants: 19,
        avgScore: 68,
        createdAt: '2 weeks ago',
        status: 'Active',
    },
    {
        id: 6,
        title: 'Wireless Networking',
        description: 'WiFi standards, security, and troubleshooting',
        questions: 16,
        duration: 30,
        difficulty: 'Easy',
        participants: 54,
        avgScore: 85,
        createdAt: '2 weeks ago',
        status: 'Active',
    },
];

export default function ShowQuizzes() {
    const outlet = useOutlet();
    const { logout, isLoading, setLoading, user, isAuthenticated } = useAuthStore();

    const loginMutation = useLogout();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            setLoading(true);
            const result = await loginMutation.mutateAsync();
            if (result.data.success) {
                logout();
                setLoading(false);
                navigate('/login');
                setTimeout(() => {
                    toast.success(result.data.message);
                }, 1000);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
            case 'Medium':
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
            case 'Hard':
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Active'
            ? 'bg-primary/10 text-primary border-primary/20'
            : 'bg-muted text-muted-foreground border-border';
    };

    return (
        <div>
            {outlet || (
                <>
                    <header className="flex h-16  items-center justify-between gap-2 border-b mx-6">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            {/* <SidebarTrigger /> */}
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <h1 className="text-lg font-semibold">Dashboard</h1>
                        </div>
                        <Button
                            variant="outline"
                            className="cursor-pointer disabled:cursor-none bg-transparent"
                            disabled={isLoading}
                            onClick={() => handleLogOut()}>
                            {isLoading ? 'Logout ...' : 'Logout'}
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Quiz Library</h2>
                                <p className="text-muted-foreground">Manage and view all your quizzes</p>
                            </div>
                            <Link to="/quizzes/create">
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Quiz
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search quizzes..."
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map((quiz) => (
                                <Card
                                    key={quiz.id}
                                    className="flex flex-col hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl leading-tight">{quiz.title}</CardTitle>
                                                <CardDescription className="mt-2 line-clamp-2">
                                                    {quiz.description}
                                                </CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Quiz
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <Badge
                                                variant="outline"
                                                className={getDifficultyColor(quiz.difficulty)}>
                                                {quiz.difficulty}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(quiz.status)}>
                                                {quiz.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <BarChart3 className="h-4 w-4" />
                                                <span>{quiz.questions} questions</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{quiz.duration} min</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                <span>{quiz.participants} students</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">Avg:</span>
                                                <span className="font-semibold text-primary">{quiz.avgScore}%</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                                        Created {quiz.createdAt}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
