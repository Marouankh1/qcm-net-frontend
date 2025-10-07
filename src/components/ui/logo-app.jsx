import { BookOpen } from 'lucide-react';
import React from 'react';

function LogoApp() {
    return (
        <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">QCM-Net</h1>
        </div>
    );
}

export default LogoApp;
