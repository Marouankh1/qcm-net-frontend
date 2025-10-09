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
                            <Link to="/quizzes/create">
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
