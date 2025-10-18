import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ProfileHeader = ({ user, getInitials }) => {
    return (
        <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-3xl font-semibold text-primary-foreground">
                    {getInitials()}
                </AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {user.first_name} {user.last_name}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
        </div>
    );
};

export default ProfileHeader;
