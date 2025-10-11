import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useOutlet } from 'react-router';

function Student() {
    const outlet = useOutlet();

    return (
        <div className={'w-full h-full'}>
            {outlet || (
                <>
                    <header className="flex h-16  items-center justify-between gap-2 border-b mx-6">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <h1 className="text-lg font-semibold">Dashboard</h1>
                        </div>
                    </header>
                    Student
                </>
            )}
        </div>
    );
}

export default Student;
