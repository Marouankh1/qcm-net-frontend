import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useOutlet } from 'react-router';
import Header from '@/components/header';
import FormAddQuestion from './components/form-add-question';

export default function AddQuestion() {
    const outlet = useOutlet();

    return (
        <div className={'w-full h-full'}>
            {outlet || (
                <>
                    <Header title="Create Questions" />

                    <FormAddQuestion />
                </>
            )}
        </div>
    );
}
