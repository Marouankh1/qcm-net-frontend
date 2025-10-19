import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const QuestionCard = ({ question, questionNumber, selectedAnswer, onAnswerSelect }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {questionNumber}
                </span>
                <div>
                    {question?.question_text}
                    <CardDescription className="mt-2">
                        {question?.points} point{question?.points !== 1 ? 's' : ''}
                    </CardDescription>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <RadioGroup
                value={selectedAnswer || ''}
                onValueChange={(value) => onAnswerSelect(question?.id, value)}
                className="space-y-3">
                {question?.choices.map((choice, index) => (
                    <div
                        key={choice.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                        <RadioGroupItem
                            value={choice.id}
                            id={`choice-${choice.id}`}
                        />
                        <Label
                            htmlFor={`choice-${choice.id}`}
                            className="flex-1 cursor-pointer text-base">
                            {String.fromCharCode(65 + index)}. {choice.choice_text}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </CardContent>
    </Card>
);

export default QuestionCard;
