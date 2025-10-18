import React, { useState } from 'react';
import { useOutlet } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import useAuthStore from '@/stores/authStore';
import useAccountStore from '@/stores/accountStore';
import { passwordSchema, profileSchema } from '@/pages/account/schema/index';
import ProfileHeader from '@/pages/account/components/profile-header';
import PersonalInformationForm from '@/pages/account/components/personal-information-form';
import ChangePasswordForm from '@/pages/account/components/change-password-form';
import { FormErrors } from '@/components/form-errors';

const AccountPage = () => {
    const [apiErrors, setApiErrors] = useState({});
    const outlet = useOutlet();
    const { user, login } = useAuthStore();
    const { isLoading, isPasswordLoading, updateProfile, updatePassword, clearError } = useAccountStore();

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            email: user?.email || '',
        },
        mode: 'onChange',
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    const getInitials = () => {
        const firstName = user.first_name;
        const lastName = user.last_name;
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    };

    const onProfileSubmit = async (data) => {
        try {
            clearError();
            const result = await updateProfile({
                firstName: data.firstName,
                lastName: data.lastName,
            });

            if (result.success) {
                login(result.data);
                toast.success('Profile information updated successfully!');

                profileForm.reset({
                    firstName: result.data.first_name,
                    lastName: result.data.last_name,
                    email: result.data.email,
                });
            }
        } catch (error) {
            if (error.errors) {
                Object.keys(error.errors).forEach((field) => {
                    const fieldErrors = error.errors[field];
                    profileForm.setError(field.toLowerCase(), {
                        type: 'server',
                        message: fieldErrors[0],
                    });
                });
            } else {
                toast.error(error.message);
            }
        }
    };

    const onPasswordSubmit = async (data) => {
        try {
            clearError();
            setApiErrors({});
            const result = await updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                newPassword_confirmation: data.confirmPassword,
            });

            if (result.success) {
                toast.success('Password updated successfully!');
                passwordForm.reset({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message || "We couldn't update your password. Please try again later.";

            if (error?.errors) {
                setApiErrors(error.errors);
                toast.error("We couldn't update your password. Please review the errors highlighted above.");
            } else {
                toast.error(errorMessage);
            }
        }
    };

    const isProfileDirty = profileForm.formState.isDirty;
    const hasProfileErrors = Object.keys(profileForm.formState.errors).length > 0;
    const isProfileSaveEnabled = isProfileDirty && !hasProfileErrors;

    const isPasswordValid = passwordForm.formState.isValid;
    const isPasswordDirty = passwordForm.formState.isDirty;
    const isPasswordSaveEnabled = isPasswordValid && isPasswordDirty;

    return (
        <div className={'w-full h-full'}>
            {outlet || (
                <>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="mx-auto w-full max-w-4xl space-y-6 py-8">
                            <ProfileHeader
                                user={user}
                                getInitials={getInitials}
                            />

                            <FormErrors errors={apiErrors} />

                            <PersonalInformationForm
                                form={profileForm}
                                onSubmit={onProfileSubmit}
                                isLoading={isLoading}
                                isSaveEnabled={isProfileSaveEnabled}
                            />

                            <ChangePasswordForm
                                form={passwordForm}
                                onSubmit={onPasswordSubmit}
                                isLoading={isPasswordLoading}
                                isSaveEnabled={isPasswordSaveEnabled}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AccountPage;
