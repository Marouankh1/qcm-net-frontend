import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuestionNavigation = ({ questions, currentIndex, hasAnswerFor, onQuestionSelect }) => (
    <Card>
        <CardHeader>
            <CardTitle>Question Navigation</CardTitle>
            <CardDescription>Click on a question number to jump to it</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => (
                    <Button
                        key={question.id}
                        variant={currentIndex === index ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onQuestionSelect(index)}
                        className={`h-10 cursor-pointer ${
                            hasAnswerFor(question.id) ? 'bg-green-100 text-green-800 border-green-200' : ''
                        }`}>
                        {index + 1}
                    </Button>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default QuestionNavigation;
