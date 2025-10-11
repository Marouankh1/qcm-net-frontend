import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import { useOutlet } from 'react-router';
import TeacherContent from './components/teacher-content';
import Header from '@/components/header';

function Teacher() {
    const outlet = useOutlet();

    return (
        <div className={'w-full h-full'}>
            {outlet || (
                <>
                    <Header title="Dashboard" />
                    <TeacherContent />
                </>
            )}
        </div>
    );
}

export default Teacher;
