import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, TrendingUp, Users } from 'lucide-react';
import React from 'react';

function TeacherContent() {
    return (
        <div>
            <div className="flex flex-1 flex-col gap-4 px-8 py-6 pt-0">
                <div className="mt-4">
                    <h2 className="text-2xl font-bold tracking-tight">Welcome to QCM-Net</h2>
                    <p className="text-muted-foreground">Your quiz management platform</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">+2 from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">156</div>
                            <p className="text-xs text-muted-foreground">+12 from last week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">87%</div>
                            <p className="text-xs text-muted-foreground">+5% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">78%</div>
                            <p className="text-xs text-muted-foreground">+3% from last month</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Quizzes</CardTitle>
                            <CardDescription>Your latest created quizzes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Network Protocols</p>
                                        <p className="text-sm text-muted-foreground">20 questions</p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">2 days ago</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">OSI Model</p>
                                        <p className="text-sm text-muted-foreground">15 questions</p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">5 days ago</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">TCP/IP Basics</p>
                                        <p className="text-sm text-muted-foreground">25 questions</p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">1 week ago</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performers</CardTitle>
                            <CardDescription>Students with highest scores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Sarah Johnson</p>
                                        <p className="text-sm text-muted-foreground">Computer Science</p>
                                    </div>
                                    <span className="font-bold text-green-600">95%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Michael Chen</p>
                                        <p className="text-sm text-muted-foreground">Network Engineering</p>
                                    </div>
                                    <span className="font-bold text-green-600">92%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Emma Williams</p>
                                        <p className="text-sm text-muted-foreground">IT Security</p>
                                    </div>
                                    <span className="font-bold text-green-600">90%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default TeacherContent;
