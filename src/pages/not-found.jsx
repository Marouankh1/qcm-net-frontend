import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="mx-auto max-w-2xl text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-7xl md:text-[180px] font-bold leading-none tracking-tighter text-primary sm:text-[240px]">
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <div className="mb-8 space-y-4">
                    <h2 className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">Page Not Found</h2>
                    <p className="text-pretty text-lg text-muted-foreground">
                        Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL
                        might be incorrect.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        asChild
                        size="lg"
                        className="max-w-96  sm:w-auto">
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Dashboard
                        </Link>
                    </Button>
                </div>

                {/* <div className="mt-8">
                    <Button
                        variant="ghost"
                        asChild
                        className="text-muted-foreground hover:text-foreground">
                        <Link to="javascript:history.back()">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go back to previous page
                        </Link>
                    </Button>
                </div> */}
            </div>
        </div>
    );
}
