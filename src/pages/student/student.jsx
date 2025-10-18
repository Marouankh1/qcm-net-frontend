import React from 'react';
import { useOutlet } from 'react-router';
import StudentContent from '@/pages/student/components/student-content';
import Header from '@/components/header';

function Student() {
    const outlet = useOutlet();

    return (
        <div className={'w-full h-full'}>
            {outlet || (
                <>
                    <Header title="Student Dashboard" />
                    <StudentContent />
                </>
            )}
        </div>
    );
}

export default Student;
