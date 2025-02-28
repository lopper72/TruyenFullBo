import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/auth-context';
import UserProfile from './user-profile';

const AccountScreen = () => {    
    return (
        <UserProfile />
    );
};

export default AccountScreen; 
