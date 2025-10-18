import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function QuizSearchBar({ searchInput, onSearchInputChange, onSearch, onClear, onKeyDown, isLoading }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search quizzes by title or description..."
                    className="pl-9 bg-white/80"
                    value={searchInput}
                    onChange={onSearchInputChange}
                    onKeyDown={onKeyDown}
                    disabled={isLoading}
                />
            </div>
            <div className="space-x-2">
                <Button
                    className="cursor-pointer"
                    onClick={onSearch}
                    variant="default"
                    disabled={isLoading}>
                    Search
                </Button>
                {onClear && (
                    <Button
                        className="cursor-pointer"
                        onClick={onClear}
                        variant="outline"
                        disabled={isLoading}>
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}
