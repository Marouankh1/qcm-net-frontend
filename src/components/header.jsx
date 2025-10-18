import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

function Header({ title = 'Dashboard' }) {
    return (
        <header className="flex h-16  items-center justify-between gap-2 border-b mx-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 cursor-pointer" />
                <Separator
                    orientation="vertical"
                    className="mr-2 h-4"
                />
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>
        </header>
    );
}

export default Header;
